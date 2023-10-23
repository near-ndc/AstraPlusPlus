const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId;
const onClose = props.onClose;
const attachDeposit = props.attachDeposit ?? 0;
const registry = props.registry;

const CoADaoId = props.dev
    ? "/*__@replace:CoADaoIdTesting__*/"
    : "/*__@replace:CoADaoId__*/";
const VotingBodyDaoId = props.dev
    ? "/*__@replace:VotingBodyDaoIdTesting__*/"
    : "/*__@replace:VotingBodyDaoId__*/";
const TCDaoId = props.dev
    ? "/*__@replace:TCDaoIdTesting__*/"
    : "/*__@replace:TCDaoId__*/";
const HoMDaoId = props.dev
    ? "/*__@replace:HoMDaoIdTesting__*/"
    : "/*__@replace:HoMDaoId__*/";

if (!accountId) {
    return "Please connect your NEAR wallet :)";
}

function isEmpty(value) {
    return !value || value === "";
}

function isNearAddress(address) {
    const ACCOUNT_ID_REGEX =
        /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
    return (
        address.length >= 2 &&
        address.length <= 64 &&
        ACCOUNT_ID_REGEX.test(address)
    );
}

State.init({
    prop_id: null, // proposal id
    error: null,
    dao: null
});

const handleProposal = () => {
    if (isEmpty(state.dao) || !isNearAddress(state.dao)) {
        State.update({
            error: "Please enter a valid DAO ID"
        });
        return;
    }

    if (isEmpty(state.prop_id)) {
        State.update({
            error: "Please enter a proposal ID"
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
    const deposit = Big(100000000000000000000000)
        .plus(Big(attachDeposit))
        .toFixed();

    const args = JSON.stringify({
        description: state.description,
        kind: { ApproveBudget: { prop_id: state.prop_id, dao: state.dao } },
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

const onChangePropID = (prop_id) => {
    State.update({
        prop_id,
        error: undefined
    });
};

const onChangeDescription = (description) => {
    State.update({
        description,
        error: undefined
    });
};

const onChangeDao = (dao) => {
    State.update({
        dao,
        error: undefined
    });
};

const defaultDescription =
    "### [Your Title Here]\n\n#### Description\n\n[Detailed description of what the proposal is about.]\n\n#### Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n#### Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n#### Budget\n\n[If applicable, outline the budget required to execute this proposal.]\n\n#### Timeline\n\n[Proposed timeline for the execution of the proposal.]";

return (
    <>
        <div className="mb-3">
            <Widget
                src={`sking.near/widget/Common.Inputs.Select`}
                props={{
                    label: "House",
                    noLabel: false,
                    placeholder: "Select house account",
                    options: [
                        { text: CoADaoId, value: CoADaoId },
                        { text: HoMDaoId, value: HoMDaoId },
                        { text: TCDaoId, value: TCDaoId }
                    ],
                    value: state.house,
                    onChange: (house) => {
                        onChangeDao(house.value);
                    },
                    error: undefined
                }}
            />
        </div>
        <div className="mb-3">
            <h5>Proposal ID</h5>
            <input
                type="number"
                onChange={(e) => onChangePropID(e.target.value)}
                min="0"
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
