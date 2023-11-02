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
                        <Widget
                            src="/*__@replace:nui__*//widget/Element.Badge"
                            props={{
                                size: "lg",
                                variant: "info outline mb-3",
                                children:
                                    "Please make sure there is no existing Veto proposal with same proposal ID created to avoid spam."
                            }}
                        />

                        {currentuserCongressHouse === CoADaoId ? (
                            <Widget
                                src="/*__@appAccount__*//widget/DAO.Proposal.Create.Veto"
                                props={{
                                    daoId: CoADaoId,
                                    dev: props.dev,
                                    registry,
                                    isHookCall: true,
                                    proposalID: proposal.id
                                }}
                            />
                        ) : (
                            <Widget
                                src="/*__@appAccount__*//widget/DAO.Proposal.Create.Veto"
                                props={{
                                    daoId: CoADaoId,
                                    dev: props.dev,
                                    registry,
                                    isHookCall: false,
                                    house: HoMDaoId,
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
