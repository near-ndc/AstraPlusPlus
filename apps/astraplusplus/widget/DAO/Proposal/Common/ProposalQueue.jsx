const daoId = props.daoId;
const accountId = props.accountId ?? context.accountId;
const onUpdate = props.onUpdate;

const VotingBodyDaoId = props.dev
    ? "/*__@replace:VotingBodyDaoIdTesting__*/"
    : "/*__@replace:VotingBodyDaoId__*/";

const isVotingBodyDao = props.daoId === VotingBodyDaoId;

State.init({
    proposalQueue: "active", // for vb
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
            <Widget
                src="nearui.near/widget/Input.Checkbox"
                props={{
                    checked: state.proposalQueue === "draft",
                    onChange: (checked) =>
                        checked
                            ? onChangeProposalQueue("draft")
                            : onChangeProposalQueue("active"),
                    label: "Draft Proposal",
                    id: "draft-proposal"
                }}
            />
        </div>
    );
} else return <></>;
