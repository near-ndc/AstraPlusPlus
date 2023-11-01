const {
    daoId,
    proposal,
    isCongressDaoID,
    isVotingBodyDao,
    daoConfig,
    isHuman,
    currentuserCongressHouse,
    CoADaoId,
    HoMDaoId,
    registry
} = props;
const accountId = context.accountId;

State.init({
    isProposalModalOpen: false
});

const proposalPastCooldown =
    proposal?.submission_time +
        daoConfig?.voting_duration +
        (daoConfig?.cooldown ?? 0) <
    Date().now;

const disableVetoButton =
    currentuserCongressHouse === CoADaoId
        ? proposalPastCooldown
        : proposal.status === "Vetoed" || proposal.status === "Rejected";

return (
    <div className="w-100">
        <Widget
            src="/*__@appAccount__*//widget/Common.Layout.CardModal"
            props={{
                title: "Veto Proposal",
                onToggle: () =>
                    State.update({
                        isProposalModalOpen: !state.isProposalModalOpen
                    }),
                isOpen: state.isProposalModalOpen,
                toggle: (
                    <button
                        className="veto-btn text-center"
                        disabled={disableVetoButton}
                    >
                        Veto
                    </button>
                ),
                content: (
                    <div
                        className="d-flex flex-column align-items-stretch"
                        style={{
                            width: "800px",
                            maxWidth: "100vw"
                        }}
                    >
                        {currentuserCongressHouse === CoADaoId ? (
                            <Widget
                                src="/*__@appAccount__*//widget/DAO.Proposal.Create.FunctionCall"
                                props={{
                                    daoId: CoADaoId,
                                    onClose: () =>
                                        State.update({
                                            isProposalModalOpen:
                                                !state.isProposalModalOpen
                                        }),
                                    isCongressDaoID,
                                    registry,
                                    isVotingBodyDao,
                                    dev: props.dev,
                                    powerType: "Veto",
                                    proposalId: proposal.id,
                                    showPowers: false
                                }}
                            />
                        ) : (
                            <Widget
                                src="/*__@appAccount__*//widget/DAO.Proposal.Create.Veto"
                                props={{
                                    daoId,
                                    dev: props.dev,
                                    registry,
                                    house: daoId,
                                    proposalID: proposal.id
                                }}
                            />
                        )}
                    </div>
                )
            }}
        />
    </div>
);
