const { Config, Post } = props;

State.init({
  community: "general",
});

const index = [
  {
    action: Config.postDataKey,
    key: state.community,
    options: {
      limit: 10,
      order: "desc",
    },
    cacheOptions: {
      ignoreCache: true,
    },
  },
];

const handleCreatePost = (body) => {
  console.log(state.community);
  Post.create(
    {
      body: body,
      type: "md",
      community: state.community,
      tags: [],
    },
    undefined,
    undefined,
    (e) => console.log("error", e),
  );
};

return (
  <div className="d-flex gap-4 p-4 w-100">
    <div className="d-flex flex-column gap-4 flex-fill">
      <select
        onChange={({ target: { value } }) => {
          State.update({ community: value });
        }}
      >
        {["general", "og", "hello"].map((o, i) => {
          return (
            <option value={o} selected={state.community === o}>
              {o}
            </option>
          );
        })}
      </select>
      <Widget
        src="/*__@replace:nui__*//widget/Social.PostCompose"
        props={{
          onPost: handleCreatePost,
        }}
      />
      <Widget
        src="mob.near/widget/MergedIndexFeed"
        props={{
          index,
          renderItem: (p) => {
            return (
              <Widget
                src="/*__@appAccount__*//widget/pages.feed.post"
                props={{ ...p, Config }}
              />
            );
          },
        }}
      />
    </div>
    <div className="d-lg-block d-none" style={{ width: 300 }}>
      sidebar
    </div>
  </div>
);
