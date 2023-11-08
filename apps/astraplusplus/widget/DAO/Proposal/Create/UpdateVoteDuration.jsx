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

function convertMinutesToMilliseconds(minutes) {
    return minutes * 60 * 1000;
}

State.init({
    pre_vote_hours: 0,
    pre_vote_minutes: 0,
    vote_hours: 0,
    vote_minutes: 0,
    error: null,
    attachDeposit: 0,
    proposalQueue: null,
    description: null
});

function isEmpty(value) {
    return !value || value === "";
}

const handleProposal = () => {
    if (isEmpty(state.pre_vote_hours) && isEmpty(state.pre_vote_minutes)) {
        State.update({
            error: "Please specify pre vote duration"
        });
        return;
    }
    if (isEmpty(state.vote_hours) && isEmpty(state.vote_minutes)) {
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

    const gas = 20000000000000;
    const deposit = state.attachDeposit
        ? Big(state.attachDeposit)
        : 100000000000000000000000;

    const args = JSON.stringify({
        description: state.description,
        kind: {
            UpdateVoteDuration: {
                vote_duration:
                    convertHoursToMilliseconds(state.vote_hours) +
                    convertMinutesToMilliseconds(state.vote_minutes),
                pre_vote_duration:
                    convertHoursToMilliseconds(state.pre_vote_hours) +
                    convertMinutesToMilliseconds(state.pre_vote_minutes)
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

const onChangePreVoteHours = (pre_vote_hours) => {
    State.update({
        pre_vote_hours,
        error: undefined
    });
};

const onChangePreVoteMinutes = (pre_vote_minutes) => {
    State.update({
        pre_vote_minutes,
        error: undefined
    });
};

const onChangeVoteHours = (vote_hours) => {
    State.update({
        vote_hours,
        error: undefined
    });
};

const onChangeVoteMinutes = (vote_minutes) => {
    State.update({
        vote_minutes,
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
        proposalQueue: queue
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
            <h5>Pre Vote Duration</h5>
            <div className="d-flex gap-2">
                <input
                    type="number"
                    placeholder="Hours"
                    onChange={(e) => onChangePreVoteHours(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Minutes"
                    onChange={(e) => onChangePreVoteMinutes(e.target.value)}
                />
            </div>
        </div>
        <div className="mb-3">
            <h5>Vote Duration</h5>
            <div className="d-flex gap-2">
                <input
                    type="number"
                    placeholder="Hours"
                    onChange={(e) => onChangeVoteHours(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Minutes"
                    onChange={(e) => onChangeVoteMinutes(e.target.value)}
                />
            </div>
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
        {console.log(state.error)}
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
