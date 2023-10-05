const daoId = props.daoId;
const proposalsPerPage = props.proposalsPerPage ?? 20; // Number of proposals to fetch at a time

const resPerPage = 20;

const constructURL = (paramObj, base) => {
    paramObj = { ...paramObj, page: "dao" };
    const baseURL = base ?? `#/${widgetOwner}/widget/home`;
    let params = "";
    for (const [key, value] of Object.entries(paramObj)) {
        params += `${key}=${value}&`;
    }
    params = params.slice(0, -1);
    return `${baseURL}?${params}`;
};

State.init({
    daoId,
    daos: [daoId],
    page: 0,
    filters: {
        proposal_types: [],
        status: [],
        time_start: "",
        time_end: ""
    },
    filtersOpen: false
});

const Wrapper = styled.div`
    .border-bottom {
        border-bottom: 2px solid lightgray;
    }

    .text-center {
        text-align: center;
    }

    .text-wrap {
        text-wrap: wrap;
    }
`;

function processProposals(proposals) {
    const parsedResp = [];
    proposals?.map((item) => {
        parsedResp.push({
            dao_id: daoId,
            last_updated: "",
            proposal: {
                id: item.id,
                kind: item.kind,
                votes: item.votes,
                status: item.status,
                proposer: item?.proposer,
                description: item.description,
                vote_counts: {},
                submission_time: item?.submission_time
            },
            proposal_type: item?.kind,
            proposal_id: item.id,
            proposer: item?.proposer,
            status: item?.status,
            submission_time: item?.submission_time,
            transaction_id: ""
        });
    });
    return { body: parsedResp };
}

const update = (newState) => State.update(newState);
const proposalsCount = Near.view(daoId, "number_of_proposals");

if (proposalsCount === null) {
    return;
}

const res = useCache(
    () =>
        Near.asyncView(daoId, "get_proposals", {
            from_index: proposalsCount,
            limit: resPerPage,
            reverse: true
        }).then((proposals) => processProposals(proposals)),
    daoId + "-proposals-congress",
    { subscribe: false }
);

if (res === null) {
    return <></>;
}

function renderHeader({ id, statusName }) {
    statusName = statusName.replace(/([A-Z])/g, " $1").trim();
    let statusicon;
    let statustext;
    let statusvariant;

    switch (statusName) {
        case "Approved":
            statusicon = "bi bi-check-circle";
            statustext = "Approved";
            statusvariant = "success";
            break;
        case "In Progress":
            statusicon = "spinner-border spinner-border-sm";
            statustext = "In Progress";
            statusvariant = "primary";
            break;
        case "Expired":
            statusicon = "bi bi-x-circle";
            statustext = "Expired";
            statusvariant = "black";
            break;
        case "Failed":
            statusicon = "bi bi-x-circle";
            statustext = "Failed";
            statusvariant = "black";
            break;
        case "Rejected":
            statusicon = "bi bi-x-circle";
            statustext = "Rejected";
            statusvariant = "danger";
            break;
    }

    return (
        <div className="d-flex flex-wrap gap-3">
            <Widget
                src="/*__@replace:nui__*//widget/Element.Badge"
                props={{
                    children: `#${id}`,
                    variant: `outline info round`,
                    size: "md"
                }}
            />

            <Widget
                src="/*__@replace:nui__*//widget/Element.Badge"
                props={{
                    children: (
                        <>
                            <i
                                className={statusicon}
                                style={{
                                    fontSize: "14px",
                                    marginRight: "5px",
                                    borderWidth: "2px",
                                    animationDuration: "8s"
                                }}
                            ></i>
                            {statustext}
                        </>
                    ),
                    variant: `${statusvariant} round`
                }}
            />
        </div>
    );
}

return (
    <Wrapper>
        {res !== null && !res.body && (
            <div className="alert alert-danger" role="alert">
                Couldn't fetch proposals from API. Please try again later.
            </div>
        )}
        <div>
            {res?.body?.length > 0 &&
                res?.body?.map((proposal) => {
                    const kindName =
                        typeof proposal.proposal_type === "string"
                            ? proposal.proposal_type
                            : Object.keys(proposal.proposal_type)[0];

                    if (proposal.status === "Removed") return <></>;
                    return (
                        <div className="d-flex py-3 justify-content-between border-bottom align-items-center">
                            <div className="d-flex flex-column gap-2">
                                {renderHeader({
                                    id: proposal.proposal_id,
                                    statusName: proposal.status
                                })}
                                <h6 className="text-wrap">
                                    {proposal.proposal.description}
                                </h6>
                            </div>
                            <div>
                                <Widget
                                    src="nearui.near/widget/Layout.Modal"
                                    props={{
                                        toggle: (
                                            <Widget
                                                src="/*__@replace:nui__*//widget/Input.Button"
                                                props={{
                                                    variant:
                                                        "info outline icon",
                                                    children: (
                                                        <i class="bi bi-eye"></i>
                                                    )
                                                }}
                                            />
                                        ),
                                        content: (
                                            <div
                                                style={{
                                                    width: 700,
                                                    maxWidth: "100%"
                                                }}
                                            >
                                                <Widget
                                                    src="astraplusplus.ndctools.near/widget/DAO.Proposals.Card.index"
                                                    props={{
                                                        daoId: daoId,
                                                        proposalString:
                                                            JSON.stringify(
                                                                proposal.proposal
                                                            ),
                                                        multiSelectMode: false,
                                                        isCongressDaoID: true
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            <div className="mt-4 d-flex justify-content-center">
                <Widget
                    src="/*__@replace:nui__*//widget/Input.Button"
                    props={{
                        variant: "info outline",
                        children: "View All",
                        href: `#//*__@appAccount__*//widget/home?page=dao&daoId=${daoId}`
                    }}
                />
            </div>
        </div>
    </Wrapper>
);
