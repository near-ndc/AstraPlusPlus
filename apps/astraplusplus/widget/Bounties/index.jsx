const defaultFilters = props.defaultFilters ?? {};

const bountiesLink = "#//*__@appAccount__*//widget/home?tab=bounties";

const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const resPerPage = 10;

// dummy data
const bounties = [
  {
    description: "description 1",
    token: "megha19.near",
    amount: 100,
    times: 3,
    max_deadline: 33,
    name: "name",
    id: 222,
  },
  {
    description: "description 1",
    token: "megha19.near",
    amount: 100,
    times: 3,
    max_deadline: 33,
    name: "dddd",
    id: 22,
  },
  {
    description: "description 1",
    token: "megha19.near",
    amount: 100,
    times: 3,
    max_deadline: 33,
    name: "ssss",
    id: 2,
  },
];

const renderBounties = () => {
  return (
    <Widget
      src="/*__@appAccount__*//widget/Bounties.List"
      props={{
        bounties,
      }}
    />
  );
};

return (
  <div>
    <h2 className="h2">Bounties</h2>
    {renderBounties()}
  </div>
);
