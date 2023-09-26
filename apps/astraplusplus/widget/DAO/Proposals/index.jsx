const daoId = props.daoId;
const proposalId = props.proposalId;

State.init({
    isProposalModalOpen: false
});

if (proposalId) {
    return (
        <div>
            <Widget
                src="/*__@appAccount__*//widget/DAO.Proposals.Card.index"
                props={props}
            />
        </div>
    );
}

return (
    <>
        <div style={{ width: "98%" }}>
            <div className="d-flex justify-content-between flex-wrap mb-3 align-items-center gap-3 pb-3">
                <h2 className="my-auto">Proposals</h2>
                <Widget
                    src="/*__@appAccount__*//widget/Common.Layout.CardModal"
                    props={{
                        title: "Create Proposal",
                        onToggle: () =>
                            State.update({
                                isProposalModalOpen: !state.isProposalModalOpen
                            }),
                        isOpen: state.isProposalModalOpen,
                        toggle: (
                            <Widget
                                src="nearui.near/widget/Input.Button"
                                props={{
                                    children: (
                                        <>
                                            Create Proposal
                                            <i className="bi bi-16 bi-plus-lg"></i>
                                        </>
                                    ),
                                    variant: "info"
                                }}
                            />
                        ),
                        content: (
                            <div
                                className="d-flex flex-column align-items-stretch"
                                style={{
                                    width: "800px",
                                    maxWidth: "100vw"
                                }}
                            >
                                <Widget
                                    src={
                                        "/*__@appAccount__*//widget/DAO.Proposal.Create"
                                    }
                                    props={{
                                        daoId: daoId
                                    }}
                                />
                            </div>
                        )
                    }}
                />
            </div>

            <Widget
                src="/*__@appAccount__*//widget/DAO.Proposals.ProposalsPikespeak"
                props={{ daoId: daoId }}
            />
        </div>
    </>
);
