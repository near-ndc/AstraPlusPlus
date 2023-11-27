const daoId = props.daoId;
const accountId = props.accountId ?? context.accountId;
const onUpdate = props.onUpdate;

const VotingBodyDaoId = props.dev
    ? "/*__@replace:VotingBodyDaoIdTesting__*/"
    : "/*__@replace:VotingBodyDaoId__*/";

const isVotingBodyDao = props.daoId === VotingBodyDaoId;

State.init({
    proposalQueue: "draft", // for vb
    attachDeposit: 0,
    vbConfig: null
});

function onChangeProposalQueue(proposalQueue) {
    const amount =
        proposalQueue === "draft"
            ? state.vbConfig?.pre_vote_bond
            : state.vbConfig?.active_queue_bond;
    onUpdate({
        queue: proposalQueue,
        amount: amount
    });
    State.update({
        ...state,
        proposalQueue: proposalQueue,
        attachDeposit: amount
    });
}

if (isVotingBodyDao) {
    const config = useCache(
        () => Near.asyncView(daoId, "config").then((data) => data),
        daoId + "-vb-config",
        { subscribe: false }
    );
    State.update({ vbConfig: config });
    onChangeProposalQueue(state.proposalQueue);
}

if (isVotingBodyDao) {
    return (
        <div className="mb-3">
            <div>
                Normally, proposals require pre-vote community support, or a one
                congress member support, to move a proposal to the active queue,
                to reduce a risk of spam. You can bond 300N if you want to skip
                the community support and do a "fast track".{" "}
                <a
                    href={`https://github.com/near-ndc/voting-v1/tree/master/voting_body#pre-vote-queue`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "rgb(68, 152, 224)" }}
                >
                    More details
                </a>{" "}
                bond 300N for a fast track [not set by default]. Draft Proposals
                are not in active queue.
            </div>
            <Widget
                src="nearui.near/widget/Input.Checkbox"
                props={{
                    checked: state.proposalQueue === "draft",
                    onChange: (checked) =>
                        checked
                            ? onChangeProposalQueue("draft")
                            : onChangeProposalQueue("active"),
                    label: "Draft",
                    id: "draft-proposal"
                }}
            />
        </div>
    );
} else return <></>;
