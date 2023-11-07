const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId;
const onClose = props.onClose;
const registry = props.registry;

if (!accountId) {
    return "Please connect your NEAR wallet :)";
}

function convertHoursToMilliseconds(hours) {
    return hours * 60 * 60 * 1000;
}

State.init({
    pre_vote_duration: 0,
    vote_duration: 0,
    error: null,
    attachDeposit: 0,
    proposalQueue: null,
    description: null
});

function isEmpty(value) {
    return !value || value === "";
}

const handleProposal = () => {
    if (isEmpty(state.pre_vote_duration)) {
        State.update({
            error: "Please specify pre vote duration"
        });
        return;
    }
    if (isEmpty(state.vote_duration)) {
        State.update({
            error: "Please specify vote duration"
        });
        return;
    }

    if (isEmpty(state.description)) {
        State.update({
            error: "Please enter a description"
        });
        return;
    }

    if (isEmpty(state.proposalQueue)) {
        State.update({
            error: "Please select proposal queue"
        });
        return;
    }

    const gas = 20000000000000;
    const deposit = state.attachDeposit
        ? Big(state.attachDeposit)
        : 100000000000000000000000;

    const args = JSON.stringify({
        description: state.description,
        kind: {
            UpdateVoteDuration: {
                vote_duration: convertHoursToMilliseconds(state.vote_duration),
                pre_vote_duration: convertHoursToMilliseconds(
                    state.pre_vote_duration
                )
            }
        },
        caller: accountId
    });

    Near.call([
        {
            contractName: registry,
            methodName: "is_human_call",
            args: {
                ctr: daoId,
                function: "create_proposal",
                payload: args
            },
            gas: gas,
            deposit: deposit
        }
    ]);
};

const onChangePreVoteDuration = (pre_vote_duration) => {
    State.update({
        pre_vote_duration,
        error: undefined
    });
};

const onChangeVoteDuration = (vote_duration) => {
    State.update({
        vote_duration,
        error: undefined
    });
};

const onChangeDescription = (description) => {
    State.update({
        description,
        error: undefined
    });
};

const onChangeQueue = ({ amount, queue }) => {
    State.update({
        attachDeposit: amount,
        proposalQueue: queue,
        error: undefined
    });
};

const defaultDescription =
    "### [Your Title Here]\n\n#### Description\n\n[Detailed description of what the proposal is about.]\n\n#### Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n#### Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n#### Budget\n\n[If applicable, outline the budget required to execute this proposal.]\n\n#### Timeline\n\n[Proposed timeline for the execution of the proposal.]";

return (
    <>
        <Widget
            src="/*__@appAccount__*//widget/DAO.Proposal.Common.ProposalQueue"
            props={{
                daoId: daoId,
                onUpdate: onChangeQueue,
                dev: props.dev
            }}
        />

        <div className="mb-3">
            <h5>Pre Vote Duration (in hours)</h5>
            <input
                type="number"
                onChange={(e) => onChangePreVoteDuration(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <h5>Vote Duration (in hours)</h5>
            <input
                type="number"
                onChange={(e) => onChangeVoteDuration(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <h5>Proposal Description</h5>
            <Widget
                src="sking.near/widget/Common.Inputs.Markdown"
                props={{
                    onChange: (value) => onChangeDescription(value),
                    height: "270px",
                    initialText: defaultDescription
                }}
            />
        </div>
        {state.error && <div className="text-danger">{state.error}</div>}
        <div className="ms-auto">
            <Widget
                src="sking.near/widget/Common.Button"
                props={{
                    children: "Create Proposal",
                    onClick: handleProposal,
                    className: "mt-2",
                    variant: "success"
                }}
            />
            {onClose && (
                <Widget
                    src="sking.near/widget/Common.Button"
                    props={{
                        children: "Close",
                        onClick: onClose,
                        className: "mt-2"
                    }}
                />
            )}
        </div>
    </>
);
