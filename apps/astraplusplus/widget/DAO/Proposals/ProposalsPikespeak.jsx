const daoId = props.daoId;
const proposalsPerPage = props.proposalsPerPage ?? 20; // Number of proposals to fetch at a time

const apiUrl = `https://api.pikespeak.ai/daos/proposals`;
const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const resPerPage = 20;

const defaultMultiSelectMode = Storage.privateGet("multiSelectMode");
const defaultTableView = Storage.privateGet("tableView");

if (defaultMultiSelectMode === null) return "";
if (defaultTableView === null) return "";

State.init({
  daoId,
  daos: [daoId],
  page: 0,
  filters: {
    proposal_types: [],
    status: [],
    time_start: "",
    time_end: "",
  },
  filtersOpen: false,
  multiSelectMode: defaultMultiSelectMode ?? false,
  tableView: defaultTableView ?? false,
});

const update = (newState) => State.update(newState);

const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params)
    .sort()
    .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

const res = fetch(
  forgeUrl(apiUrl, {
    offset: state.page * resPerPage,
    limit: resPerPage,
    daos: state.daos,
    proposal_types: state.filters.proposal_types,
    status: state.filters.status,
    time_start: state.filters.time_start,
    time_end: state.filters.time_end,
  }),
  {
    mode: "cors",
    headers: {
      "x-api-key": publicApiKey,
    },
  },
);

const preloadNextPage = () => {
  fetch(
    forgeUrl(apiUrl, {
      offset: (state.page + 1) * resPerPage,
      limit: resPerPage,
      daos: state.daos,
      proposal_types: state.filters.proposal_types,
      status: state.filters.status,
      time_start: state.filters.time_start,
      time_end: state.filters.time_end,
    }),
    {
      mode: "cors",
      headers: {
        "x-api-key": publicApiKey,
      },
    },
  );
};

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
                color: "#4F46E5",
              }}
            />
          ),
          inputProps: {
            title: "Disabled because no API for searching yet",
          },
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
          variant: "secondary outline",
          size: "md",
          onClick: () => {
            Storage.privateSet("multiSelectMode", !state.multiSelectMode);
            State.update({
              ...state,
              multiSelectMode: !state.multiSelectMode,
            });
          },
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
          variant: "secondary outline",
          size: "md",
          onClick: () => {
            Storage.privateSet("tableView", !state.tableView);
            State.update({
              ...state,
              tableView: !state.tableView,
            });
          },
        }}
      />
      <Widget
        src="nearui.near/widget/Layout.Modal"
        props={{
          open: state.filtersOpen,
          onOpenChange: (open) => {
            State.update({
              ...state,
              filtersOpen: open,
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
                variant: "secondary outline",
                size: "md",
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
                    filtersOpen: false,
                  });
                },
                applyFilters: (filters) => {
                  State.update({
                    ...state,
                    filters,
                    filtersOpen: false,
                  });
                },
              }}
            />
          ),
        }}
      />
    </div>
    {res !== null && !res.body && (
      <div className="alert alert-danger" role="alert">
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
          }}
        />
      ) : (
        <Widget
          src="/*__@appAccount__*//widget/DAO.Proposals.CardsList"
          props={{
            state,
            resPerPage,
            proposals: res === null ? null : res.body,
          }}
        />
      )}

      <div className="d-flex justify-content-center my-4">
        <Widget
          src="nearui.near/widget/Navigation.PrevNext"
          props={{
            hasPrev: state.page > 0,
            hasNext: res && res.body.length == resPerPage,
            onPrev: () => {
              update({
                page: state.page - 1,
              });
            },
            onNext: () => {
              update({
                page: state.page + 1,
              });
            },
            nextProps: {
              onMouseEnter: preloadNextPage,
            },
            nextHref: `#proposals-top`,
          }}
        />
      </div>
    </div>
    {state.multiSelectMode && (
      <>
        <div
          style={{
            height: 180,
            width: "100%",
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
                multiSelectMode: false,
              });
              Storage.privateSet("multiSelectMode", false);
            },
          }}
        />
      </>
    )}
  </>
);
