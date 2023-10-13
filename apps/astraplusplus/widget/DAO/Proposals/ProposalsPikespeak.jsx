const daoId = props.daoId;

const apiUrl = `https://api.pikespeak.ai/daos/proposals`;
const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const resPerPage = 20; // Number of proposals to fetch at a time

const defaultMultiSelectMode = Storage.privateGet("multiSelectMode");
const defaultTableView = Storage.privateGet("tableView");

if (defaultMultiSelectMode === null) return "";
if (defaultTableView === null) return "";

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

const proposalsCount = Near.view(daoId, "number_of_proposals");

if (proposalsCount === null) {
    return;
}

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
    filtersOpen: false,
    multiSelectMode: defaultMultiSelectMode ?? false,
    tableView: defaultTableView ?? false,
    daoConfig: null
});

// convert to the data structure required by proposals component (similar to pikespeak API)
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

const forgeUrl = (apiUrl, params) =>
    apiUrl +
    Object.keys(params)
        .sort()
        .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

function fetchCongressDaoProposals() {
    const data = [];
    const resp = Near.view(daoId, "get_proposals", {
        from_index:
            state.page === 0
                ? proposalsCount
                : proposalsCount - state.page * resPerPage,
        limit: resPerPage,
        reverse: true
    });
    if (resp) {
        data = processProposals(resp);
    }
    return data;
}
const res = isCongressDaoID
    ? fetchCongressDaoProposals()
    : fetch(
          forgeUrl(apiUrl, {
              offset: state.page * resPerPage,
              limit: resPerPage,
              daos: state.daos,
              proposal_types: state.filters.proposal_types,
              status: state.filters.status,
              time_start: state.filters.time_start,
              time_end: state.filters.time_end
          }),
          {
              mode: "cors",
              headers: {
                  "x-api-key": publicApiKey
              }
          }
      );

// filtering for congress daos
if (isCongressDaoID) {
    if (state.filters.proposal_types?.length > 0) {
        res.body = res.body?.filter((item) => {
            const type =
                typeof item.proposal_type === "string"
                    ? item.proposal_type
                    : Object.keys(item.proposal_type)[0];
            return state.filters.proposal_types.includes(type);
        });
    }
    if (state.filters.status?.length > 0) {
        res.body = res.body?.filter((item) =>
            state.filters.status.includes(item.status)
        );
    }
}

function hasNextHandler() {
    const hasNext = false;
    if (isCongressDaoID) {
        hasNext =
            state.page === 0
                ? proposalsCount > resPerPage
                : proposalsCount > state.page * resPerPage;
    } else {
        hasNext = resPerPage === res.body.length;
    }

    return hasNext;
}

function getDaoConfig() {
    if (isCongressDaoID) {
        const daoConfig = Near.view(daoId, "config", {});
        State.update({ daoConfig });
    }
}

getDaoConfig();

return (
    <>
        <div
            className="d-flex align-items-center gap-2 flex-wrap-reverse justify-content-end"
            id="proposals-top"
        >
            <Widget
                src="nearui.near/widget/Input.Text"
                props={{
                    placeholder: "Search by proposal ID or name",
                    disabled: true,
                    type,
                    size,
                    icon: (
                        <i
                            className="bi bi-search"
                            style={{
                                color: "#4F46E5"
                            }}
                        />
                    ),
                    inputProps: {
                        title: "Disabled because no API for searching yet"
                    }
                }}
            />
            <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                    children: state.multiSelectMode ? (
                        <>
                            Multi-Vote
                            <i class="bi bi-x-lg"></i>
                        </>
                    ) : (
                        <>
                            Multi-Vote
                            <i class="bi bi-card-checklist"></i>
                        </>
                    ),
                    variant: "info outline",
                    size: "md",
                    onClick: () => {
                        Storage.privateSet(
                            "multiSelectMode",
                            !state.multiSelectMode
                        );
                        State.update({
                            ...state,
                            multiSelectMode: !state.multiSelectMode
                        });
                    }
                }}
            />
            <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                    children: (
                        <>
                            Table View
                            {state.tableView ? (
                                <i className="bi bi-x-lg"></i>
                            ) : (
                                <i className="bi bi-table"></i>
                            )}
                        </>
                    ),
                    variant: "info outline",
                    size: "md",
                    onClick: () => {
                        Storage.privateSet("tableView", !state.tableView);
                        State.update({
                            ...state,
                            tableView: !state.tableView
                        });
                    }
                }}
            />
            <Widget
                src="nearui.near/widget/Layout.Modal"
                props={{
                    open: state.filtersOpen,
                    onOpenChange: (open) => {
                        State.update({
                            ...state,
                            filtersOpen: open
                        });
                    },
                    toggle: (
                        <Widget
                            src="nearui.near/widget/Input.Button"
                            props={{
                                children: (
                                    <>
                                        Filter
                                        <i className="bi bi-funnel"></i>
                                    </>
                                ),
                                variant: "info outline",
                                size: "md"
                            }}
                        />
                    ),
                    content: (
                        <Widget
                            src="/*__@appAccount__*//widget/DAO.Proposals.FilterModal"
                            props={{
                                filters: state.filters,
                                cancel: () => {
                                    State.update({
                                        ...state,
                                        filtersOpen: false
                                    });
                                },
                                applyFilters: (filters) => {
                                    State.update({
                                        ...state,
                                        filters,
                                        filtersOpen: false
                                    });
                                }
                            }}
                        />
                    )
                }}
            />
        </div>
        {res !== null && !res.body && (
            <div className="alert alert-danger mt-2" role="alert">
                Couldn't fetch proposals from API. Please try again later.
            </div>
        )}

        <div>
            {state.tableView ? (
                <Widget
                    src="/*__@appAccount__*//widget/DAO.Proposals.Table.index"
                    props={{
                        state,
                        resPerPage,
                        proposals: res === null ? null : res.body,
                        isCongressDaoID,
                        daoConfig: state.daoConfig
                    }}
                />
            ) : (
                <Widget
                    src="/*__@appAccount__*//widget/DAO.Proposals.CardsList"
                    props={{
                        state,
                        resPerPage,
                        proposals: res === null ? null : res.body,
                        isCongressDaoID,
                        daoConfig: state.daoConfig
                    }}
                />
            )}

            <div className="d-flex justify-content-center my-4">
                <Widget
                    src="nearui.near/widget/Navigation.PrevNext"
                    props={{
                        hasPrev: state.page > 0,
                        hasNext: hasNextHandler(),
                        onPrev: () => {
                            update({
                                page: state.page - 1
                            });
                        },
                        onNext: () => {
                            update({
                                page: state.page + 1
                            });
                        },
                        nextHref: `#proposals-top`
                    }}
                />
            </div>
        </div>
        {state.multiSelectMode && (
            <>
                <div
                    style={{
                        height: 180,
                        width: "100%"
                    }}
                ></div>
                <Widget
                    src="/*__@appAccount__*//widget/DAO.Proposals.MultiVote"
                    props={{
                        daoId: state.daoId,
                        view: "submit",
                        onHideMultiSelect: () => {
                            State.update({
                                ...state,
                                multiSelectMode: false
                            });
                            Storage.privateSet("multiSelectMode", false);
                        },
                        isCongressDaoID
                    }}
                />
            </>
        )}
    </>
);
