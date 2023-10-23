const daoId = props.daoId;
const accountId = props.accountId ?? context.accountId;
const onUpdate = props.onUpdate;

const VotingBodyDaoId = props.dev
    ? "/*__@replace:VotingBodyDaoIdTesting__*/"
    : "/*__@replace:VotingBodyDaoId__*/";

const isVotingBodyDao = props.daoId === VotingBodyDaoId;

State.init({
    proposalQueue: null, // for vb
    attachDeposit: 0,
    vbConfig: null
});

if (isVotingBodyDao) {
    const config = useCache(
        () => Near.asyncView(daoId, "config").then((data) => data),
        daoId + "-vb-config",
        { subscribe: false }
    );
    State.update({ vbConfig: config });
}

if (isVotingBodyDao) {
    return (
        <div className="mb-3">
            <Widget
                src={`sking.near/widget/Common.Inputs.Select`}
                props={{
                    label: "Proposal Queue",
                    noLabel: true,
                    placeholder: "Select Proposal Queue",
                    options: [
                        {
                            text: "Pre-Vote Queue",
                            value: "pre-vote"
                        },
                        {
                            text: "Active Queue",
                            value: "active"
                        }
                    ],
                    value: state.proposalQueue,
                    onChange: (proposalQueue) => {
                        const amount =
                            proposalQueue.value === "pre-vote"
                                ? state.vbConfig?.pre_vote_bond
                                : state.vbConfig?.active_queue_bond;
                        onUpdate({
                            queue: proposalQueue.value,
                            amount: amount
                        });
                        State.update({
                            ...state,
                            proposalQueue: proposalQueue.value,
                            attachDeposit: amount
                        });
                    },
                    error: undefined
                }}
            />
        </div>
    );
} else return <></>;
