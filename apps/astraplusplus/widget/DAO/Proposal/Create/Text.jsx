const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const onClose = props.onClose;
const isCongressDaoID = props.isCongressDaoID;

const HoMDaoId = "/*__@replace:HoMDaoId__*/";

if (!accountId) {
    return "Please connect your NEAR wallet :)";
}

State.init({
    description: state.description,
    error: state.error,
    powerType: null
});

// only for UI
const powerTypes = [
    {
        text: "Propose Budget",
        value: "Budget"
    },
    {
        text: "Propose Motion",
        value: "Motion"
    }
];

const handleProposal = () => {
    if (!state.description) {
        State.update({
            error: "Please enter a description"
        });
        return;
    }
    const gas = 200000000000000;
    const deposit = 100000000000000000000000;

    const args = isCongressDaoID
        ? {
              description: state.description,
              kind: "Text"
          }
        : {
              proposal: {
                  description: state.description,
                  kind: "Vote"
              }
          };

    Near.call([
        {
            contractName: daoId,
            methodName: isCongressDaoID ? "create_proposal" : "add_proposal",
            args: args,
            gas: gas,
            deposit: deposit
        }
    ]);
};

const onChangeDescription = (description) => {
    State.update({
        description,
        error: undefined
    });
};

const defaultDescription =
    "### [Your Title Here]\n\n#### Description\n\n[Detailed description of what the proposal is about.]\n\n#### Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n#### Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n#### Budget\n\n[If applicable, outline the budget required to execute this proposal.]\n\n#### Timeline\n\n[Proposed timeline for the execution of the proposal.]";

return (
    <>
        {daoId === HoMDaoId && (
            <div className="mb-2">
                <Widget
                    src={`sking.near/widget/Common.Inputs.Select`}
                    props={{
                        label: "Power",
                        noLabel: false,
                        placeholder: "Can propose motion",
                        options: powerTypes,
                        value: state.powerType,
                        onChange: (powerType) =>
                            State.update({
                                ...state,
                                powerType: powerType.value
                            }),
                        error: undefined
                    }}
                />
            </div>
        )}
        <h5>Proposal Description</h5>
        <Widget
            src="sking.near/widget/Common.Inputs.Markdown"
            props={{
                onChange: (value) => onChangeDescription(value),
                height: "270px",
                initialText: defaultDescription
            }}
        />
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
