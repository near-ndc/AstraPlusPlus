const accountId = props.accountId ?? context.accountId;
const contractId = props.contractId;
const onClose = props.onClose;
const isCongressDaoID = props.isCongressDaoID;

if (!accountId) {
    return "Please connect your NEAR wallet :)";
}

State.init({
    contractId: state.contractId,
    method_name: state.method_name,
    args: state.args || "{}",
    deposit: state.deposit || "0",
    gas: null,
    error: undefined,
    receiver_id: null,
    description: null
});

const fc_args = Buffer.from(state.args, "utf-8").toString("base64");

function isNearAddress(address) {
    const ACCOUNT_ID_REGEX =
        /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
    return (
        address.length >= 2 &&
        address.length <= 64 &&
        ACCOUNT_ID_REGEX.test(address)
    );
}

const handleFunctionCall = () => {
    if (
        !state.contractId ||
        state.contractId === "" ||
        !isNearAddress(state.contractId)
    ) {
        State.update({
            error: "Please enter a valid contract ID"
        });
        return;
    }
    if (!state.method_name || state.method_name === "") {
        State.update({
            error: "Please enter a valid method name"
        });
        return;
    }
    const is_valid_json = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
    if (!state.args || state.args === "" || !is_valid_json(state.args)) {
        State.update({
            error: "Please enter a valid JSON arguments"
        });
        return;
    }
    if (!state.deposit || state.deposit < 0) {
        State.update({
            error: "Please enter a valid deposit"
        });
        return;
    }
    if (state.gas && state.gas <= 0) {
        State.update({
            error: "Please enter a valid gas"
        });
        return;
    }

    const deposit = Big(state.deposit).mul(Big(10).pow(24)).toFixed();

    if (isCongressDaoID) {
        if (!state.receiver_id || !isNearAddress(state.receiver_id)) {
            State.update({
                error: "Please enter a valid recipient address"
            });
            return;
        }
        if (!state.description) {
            State.update({
                error: "Please enter a description"
            });
            return;
        }

        Near.call([
            {
                contractName: daoId,
                methodName: "create_proposal",
                args: {
                    kind: `'{"FunctionCall": {"receiver_id": ${state.receiver_id}, "actions": [{"method_name": ${state.methodName}, "args": ${fc_args}, "deposit": ${deposit}, "gas": ${state.gas}}]}}, "description": ${state.description}}`
                },
                deposit: 100000000000000000000000,
                gas: 200000000000000
            }
        ]);
    } else {
        Near.call([
            {
                contractName: state.contractId,
                methodName: state.method_name,
                args: {
                    Arguments: fc_args
                },
                deposit: deposit,
                gas: state.gas ?? "200000000000000"
            }
        ]);
    }
};

const onChangeContract = (contractId) => {
    State.update({
        contractId,
        error: undefined
    });
};

const onChangeMethod = (method_name) => {
    State.update({
        method_name,
        error: undefined
    });
};

const onChangeArgs = (args) => {
    State.update({
        args,
        error: undefined
    });
};

const onChangeGas = (gas) => {
    State.update({
        gas,
        error: undefined
    });
};

const onChangeDeposit = (deposit) => {
    State.update({
        deposit,
        error: undefined
    });
};

const onChangeDescription = (description) => {
    State.update({
        description,
        error: undefined
    });
};

const onChangeRecipient = (receiver_id) => {
    State.update({
        receiver_id: receiver_id,
        error: undefined
    });
};

const defaultDescription =
    "# [Your Title Here]\n\n## Description\n\n[Detailed description of what the proposal is about.]\n\n## Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n## Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n## Budget\n\n[If applicable, outline the budget required to execute this proposal.]\n\n## Timeline\n\n[Proposed timeline for the execution of the proposal.]";

return (
    <>
        <div className="mb-3">
            <h5>Contract</h5>
            <input
                type="text"
                onChange={(e) => onChangeContract(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <h5>Method</h5>
            <input
                type="text"
                onChange={(e) => onChangeMethod(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <h5>Deposit</h5>
            <input
                type="number"
                onChange={(e) => onChangeDeposit(e.target.value)}
                defaultValue="0"
            />
        </div>
        <div className="mb-3">
            <h5>Gas</h5>
            <input
                type="number"
                onChange={(e) => onChangeGas(e.target.value)}
                defaultValue="200000000000000"
            />
        </div>
        <div className="mb-3">
            <h5>Arguments (JSON)</h5>
            <textarea
                type="text"
                onChange={(e) => onChangeArgs(e.target.value)}
                className="form-control"
                defaultValue={state.args}
            />
        </div>
        {isCongressDaoID && (
            <div>
                <div className="mb-3">
                    <h5>Recipient</h5>
                    <input
                        type="text"
                        onChange={(e) => onChangeRecipient(e.target.value)}
                        placeholder="Specify target account"
                    />
                </div>
                <div className="mb-3">
                    <h5>Description</h5>

                    <Widget
                        src="sking.near/widget/Common.Inputs.Markdown"
                        props={{
                            onChange: (value) => onChangeDescription(value),
                            height: "270px",
                            initialText: defaultDescription
                        }}
                    />
                </div>
            </div>
        )}
        {state.error && <div className="text-danger">{state.error}</div>}
        <div className="ms-auto">
            <Widget
                src="sking.near/widget/Common.Button"
                props={{
                    children: "Propose Function Call",
                    onClick: handleFunctionCall,
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
