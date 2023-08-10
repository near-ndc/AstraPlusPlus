const accountId = props.accountId ?? context.accountId ?? "sking.near";

let following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
});

if (following === null) {
  return "";
}

following = Object.keys(following[accountId].graph.follow).filter((account) =>
  account.endsWith(".sputnik-dao.near")
);



const feeds = [
  {
    name: "daos followed",
    data: {
      sources: [
        {
          domain: "post",
          key: "main",
        },
      ],
      typeWhitelist: ["md"],
      accountWhitelist: following,
    },
  },
];

const renderHeader = () => (
  <div>
    <h2 className="h2">Social Feed</h2>
    <p className="text-muted">Social posts from the DAOs you follow</p>

    <div>
      {following.length < 1 ? (
        <div className="text-muted mt-4">You are not following any DAOs</div>
      ) : (
        <Widget
          src="efiz.near/widget/every.post"
          props={{
            ...feeds[0].data,
          }}
        />
      )}
    </div>
  </div>
);

return <div>{renderHeader()}</div>;
