const baseApi = "https://api.pikespeak.ai/daos/proposals";
const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const resPerPage = 20;
const accountId = context.accountId;
const daos = [
  "ndctrust.sputnik-dao.near",
  "build.sputnik-dao.near",
  "orderly-ops.sputnik-dao.near"
];

State.init({
  page: 0
});

const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params)
    .sort()
    .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

function fetchProposals() {
  const resp = fetch(
    forgeUrl(baseApi, {
      daos: daos,
      offset: state.page * resPerPage,
      limit: resPerPage,
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

  return resp;
}

const update = (newState) => State.update(newState);

let res = fetchProposals();

function hasNextHandler() {
  const hasNext = false;
  hasNext = resPerPage === res.body.length;
  return hasNext;
}

return (
  <>
    <div>
      <h3>Global Proposals Feed</h3>
    </div>
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
    </div>
    {res !== null && !res.body && (
      <div className="alert alert-danger mt-2" role="alert">
        Couldn't fetch proposals from API. Please try again later.
      </div>
    )}
    <div>
      <Widget
        src="/*__@appAccount__*//widget/DAO.Proposals.CardsList"
        props={{
          state,
          resPerPage,
          proposals: res === null ? null : res.body
        }}
      />
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
  </>
);
