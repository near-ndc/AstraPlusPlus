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
  get: (pid) => {},
  create: (post, onCommit, onCancel, onError) => {
    const error = Helpers.post.validate(post);
    if (error !== null) {
      return onError(error);
    }
    const commit = Helpers.post.prepare(post);
    Social.set(commit, { force: true, onCommit, onCancel });
  },
  like: (pid, remove) => {},
  comment: (pid, comment) => {},
  react: (pid, reaction) => {},
  save: (pid) => {},
};

const Feed = {
  get: () => {},
};

const Config = {
  postDataKey: isDev ? "voice-dev" : "voice",
  postTypes: ["md"],
  version: "0" + (isDev ? ".alpha" : ""),
};

// --- Return
return (
  <Widget
    src={widget}
    props={{
      ...props,
      Config,
      Feed,
      Post,
    }}
  />
);
