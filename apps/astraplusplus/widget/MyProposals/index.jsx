const baseApi = "https://api.pikespeak.ai/daos/proposals-by-proposer";
const resPerPage = 20;
const defaultMultiSelectMode = Storage.privateGet("multiSelectMode");
const defaultTableView = Storage.privateGet("tableView");

if (defaultMultiSelectMode === null) return "";

State.init({
    multiSelectMode: defaultMultiSelectMode ?? false,
    tableView: defaultTableView ?? false
});

function fetchMyProposals() {
    asyncFetch(`${baseApi}/${context.accountId}?limit=${resPerPage}&offset=0`, {
        method: "GET",
        headers: { "x-api-key": "/*__@replace:pikespeakApiKey__*/" }
    }).then((resp) => {
        if (resp?.body) State.update({ proposals: resp });
    });
}

fetchMyProposals();

return (
    <div>
        <div className="d-flex justify-content-between flex-wrap mb-3 align-items-center gap-3 pb-3">
            <h2 className="my-auto">My Proposals</h2>
        </div>

        <div className="w-100">
            <Widget
                src="/*__@appAccount__*//widget/DAO.Proposals.ProposalsPikespeak"
                props={{ proposals: state.proposals, dev: props.dev }}
            />
        </div>
    </div>
);
