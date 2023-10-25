const defaultFilters = props.defaultFilters ?? {};
const daoId = props.accountId;
const bountiesLink = "#//*__@appAccount__*//widget/home?tab=bounties";
const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const resPerPage = 10;
const baseApi = "https://api.pikespeak.ai";

State.init({
    bounties: []
});

function fetchBounties() {
    const res = fetch(`${baseApi}/daos/bounties/${daoId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": publicApiKey
        }
    });

    if (res?.body?.length) State.update({ bounties: res.body });
}

fetchBounties();

return (
    <Widget
        src="/*__@appAccount__*//widget/DAO.Bounties.List"
        props={{ bounties: state.bounties }}
    />
);
