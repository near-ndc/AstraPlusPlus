const { accountId, blockHeight, Config } = props;

const post = JSON.parse(
  Social.get(`${accountId}/${Config.postDataKey}/main`, blockHeight) ?? "null",
);
if (post === null) return <></>;

return (
  <Widget
    src="/*__@replace:nui__*//widget/Social.PostCard"
    props={{
      post,
      containerProps: {
        className: "mb-4",
      },
    }}
  />
);
