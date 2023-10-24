const {
    proposals,
    resPerPage,
    state,
    update,
    isCongressDaoID,
    daoConfig,
    isVotingBodyDao
} = props;

return (
    <div>
        {proposals === null && state.multiSelectMode && (
            <>
                {new Array(resPerPage).fill(0).map((_, i) => (
                    <Widget src="astraplusplus.ndctools.near/widget/DAO.Proposals.Card.skeleton" />
                ))}
            </>
        )}
        {proposals !== null &&
            proposals.map(({ proposal, proposal_type, proposal_id }, i) => {
                if (!isCongressDaoID && !isVotingBodyDao) {
                    proposal.kind = {
                        [proposal_type]: {
                            ...proposal.kind
                        }
                    };
                }

                proposal.id = proposal_id;
                if (proposal.status === "Removed") return <></>;
                Object.keys(proposal.vote_counts).forEach((k) => {
                    if (typeof proposal.vote_counts[k] == "string") {
                        proposal.vote_counts[k] = proposal.vote_counts[k]
                            .match(/.{1,2}/g)
                            .map((x) => parseInt(x));
                    }
                });
                return (
                    <Widget
                        key={i}
                        src={
                            "astraplusplus.ndctools.near/widget/DAO.Proposals.Card.index"
                        }
                        props={{
                            daoId: state.daoId,
                            proposalString: JSON.stringify(proposal),
                            multiSelectMode: state.multiSelectMode,
                            isCongressDaoID,
                            isVotingBodyDao,
                            daoConfig,
                            dev: props.dev
                        }}
                    />
                );
            })}
    </div>
);
