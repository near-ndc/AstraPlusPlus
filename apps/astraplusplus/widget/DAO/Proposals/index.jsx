const daoId = props.daoId;
const proposalId = props.proposalId;
const accountId = context.accountId ?? "";

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

const isCongressDaoID =
    daoId === HoMDaoId ||
    daoId === VotingBodyDaoId ||
    daoId === CoADaoId ||
    daoId === TCDaoId;

State.init({
    isProposalModalOpen: false,
    hideProposalBtn: false
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

if (isCongressDaoID) {
    const policy = Near.view(daoId, "get_members");
    const isMember = policy?.members?.includes(accountId);
    State.update({ hideProposalBtn: !isMember });
}

return (
    <>
        <div style={{ width: "98%" }}>
            <div className="d-flex justify-content-between flex-wrap mb-3 align-items-center gap-3 pb-3">
                <h2 className="my-auto">Proposals</h2>
                {!state.hideProposalBtn && (
                    <Widget
                        src="/*__@appAccount__*//widget/Common.Layout.CardModal"
                        props={{
                            title: "Create Proposal",
                            onToggle: () =>
                                State.update({
                                    isProposalModalOpen:
                                        !state.isProposalModalOpen
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
                )}
            </div>

            <Widget
                src="/*__@appAccount__*//widget/DAO.Proposals.ProposalsPikespeak"
                props={{ daoId: daoId, dev: props.dev }}
            />
        </div>
    </>
);
