/** Contains Business Logic **/

// --- Init
const isDev = true;
const { widget } = props;

// --- Helpers

const UUID = {
  generate: (template) => {
    if (typeof template !== "string") {
      template = "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx";
    }
    return template.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};

const Helpers = {
  post: {
    validate: (post) => {
      if (typeof post.body !== "string") return "Post body is required!";
      if (post.body.length < 4)
        return "Post body should contains at least 4 characters!";
      if (!Config.postTypes.includes(post.type))
        return `Invalid post type, expected one of the following: ${Config.postTypes.join(
          ", ",
        )}`;
      if (!Array.isArray(post.tags))
        return "Invalid post tags, expected an array";
      if (post.tags.length > 9) return "Maximum 10 tags per post";
      return null;
    },
    prepare: (post) => {
      const pid = post.pid ?? UUID.generate();
      return {
        [Config.postDataKey]: {
          main: JSON.stringify({
            id: pid,
            type: post.type ?? "md",
            community: post.community ?? "general",
            tags: post.tags ?? [],
            author: context.accountId,
            updatedAt: post.updatedAt || post.createdAt || Date.now(),
            createdAt: post.createdAt || Date.now(),
            body: post.body,
            version: Config.version,
          }),
        },
        index: {
          // TODO, index by tags
          [Config.postDataKey]: JSON.stringify({
            key: post.community ?? "general",
            value: {
              type: post.type ?? "md",
              id: pid,
            },
          }),
        },
      };
    },
  },
};

// --- Main
const Post = {
  get: (author, blockHeight) => {
    return JSON.parse(
      Social.get(`${author}/${Config.postDataKey}/main`, blockHeight, {
        subscribe: false,
      }) ?? "null",
    );
  },
  getLikes: (author, blockHeight) => {
    const likesArray = Social.index(
      Config.likeKey,
      {
        type: "social",
        blockHeight: blockHeight,
        path: `${author}/${Config.postDataKey}/main`,
      },
      {
        subscribe: false,
      },
    );
    if (likesArray === null) return null;
    const likesByUsers = {};
    (likesArray || []).forEach((like) => {
      if (like.value.type === "like") {
        likesByUsers[like.accountId] = like;
      } else if (like.value.type === "unlike") {
        delete likesByUsers[like.accountId];
      }
    });
    return likesByUsers;
  },
  getReactions: (author, blockHeight) => {
    const reactionsArray = Social.index(
      Config.reactKey,
      {
        type: "social",
        blockHeight: blockHeight,
        path: `${author}/${Config.postDataKey}/main`,
      },
      {
        subscribe: false,
      },
    );
    if (reactionsArray === null) return null;
    const reactionsByUsers = {};
    (reactionsArray || []).forEach((reaction) => {
      if (reaction.value.type === "null") {
        delete reactionsByUsers[like.accountId];
      } else {
        reactionsByUsers[reaction.accountId] = reaction.value.type;
      }
    });
    return reactionsByUsers;
  },

  create: (post, onCommit, onCancel, onError) => {
    const error = Helpers.post.validate(post);
    if (error !== null) {
      return onError(error);
    }
    const commit = Helpers.post.prepare(post);
    Social.set(commit, { force: true, onCommit, onCancel });
  },
  like: ({ postAuthor, postBlockHeight }, unlike, onCommit, onCancel) => {
    const postItem = {
      type: "social", // TODO: IDK if this should be changed
      blockHeight: postBlockHeight,
      path: `${postAuthor}/${Config.postDataKey}/main`,
    };
    const commit = {
      index: {
        [Config.likeKey]: JSON.stringify({
          key: postItem,
          value: {
            type: unlike ? "unlike" : "like",
          },
        }),
        [Config.notifyKey]: JSON.stringify({
          key: postAuthor,
          value: {
            type: unlike ? "unlike" : "like",
            item: postItem,
          },
        }),
      },
    };
    Social.set(commit, { force: true, onCommit, onCancel });
  },
  react: ({ postAuthor, postBlockHeight }, reaction, onCommit, onCancel) => {
    const postItem = {
      type: "social", // TODO: IDK if this should be changed
      blockHeight: postBlockHeight,
      path: `${postAuthor}/${Config.postDataKey}/main`,
    };
    const commit = {
      index: {
        [Config.reactKey]: JSON.stringify({
          key: postItem,
          value: {
            type: reaction ? reaction : "null",
          },
        }),
      },
    };

    if (reaction) {
      commit.index[Config.notifyKey] = JSON.stringify({
        key: postAuthor,
        value: {
          type: reaction ? reaction : "null",
          item: postItem,
        },
      });
    }

    Social.set(commit, { force: true, onCommit, onCancel });
  },
  comment: (pid, comment) => {},
  save: (pid) => {},
};

const Config = {
  postDataKey: isDev ? "voice-dev" : "voice",
  postTypes: ["md"],
  likeKey: "like",
  reactKey: "react",
  notifyKey: "notify",
  version: "0" + (isDev ? ".alpha" : ""),
  SBTRegistry: "registry.i-am-human.near",
};

// --- Return
return (
  <Widget
    src={widget}
    props={{
      ...props,
      Config,
      Post,
    }}
  />
);
