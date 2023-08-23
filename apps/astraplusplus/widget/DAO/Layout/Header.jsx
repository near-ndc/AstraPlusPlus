const daoId = props.daoId;
const profile = daoId ? Social.get(`${daoId}/profile/**`, "final") : {};
const currentLink = `#//*__@appAccount__*//widget/index?page=dao&daoId=${daoId}`;

State.init({
  joinRole: "council",
});

// Follower Count:
const following = Social.keys(`${daoId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
const followers = Social.keys(`*/graph/follow/${daoId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});
const followingCount = following
  ? Object.keys(following[daoId].graph.follow || {}).length
  : null;

const followersCount = followers ? Object.keys(followers || {}).length : null;

const policy = useCache(
  () =>
    Near.asyncView(daoId, "get_policy").then((policy) => {
      return {
        policy,
      };
    }),
  daoId + "-policy",
  { subscribe: false },
);

const config = useCache(
  () =>
    Near.asyncView(daoId, "get_config").then((config) => ({
      ...config,
      metadata: config.metadata
        ? JSON.parse(Buffer.from(config.metadata, "base64").toString())
        : null,
    })),
  daoId + "-config",
  { subscribe: false },
);

if (policy === null) return "";
if (config === null) return "";

profile = {
  ...profile,
  name: profile.name || config.metadata?.displayName || daoId,
  description: profile.description || config.purpose,
  backgroundImage:
    profile.backgroundImage ||
    `https://astro-prod-ui.s3.us-east-1.amazonaws.com/${config.metadata?.flagCover}`,
  image:
    profile.image ||
    `https://astro-prod-ui.s3.us-east-1.amazonaws.com/${config.metadata?.flagLogo}`,
};

const roles = policy.policy.roles
  .filter((r) => r.kind !== "Everyone")
  .map((r) => r.name);

const onAddUserProposal = (memberId, roleId) => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "Potential member",
          kind: {
            AddMemberToRole: {
              member_id: memberId,
              role: roleId ?? "council",
            },
          },
        },
      },
      gas: 219000000000000,
      deposit: policy.policy.proposal_bond || 100000000000000000000000,
    },
  ]);
};

const BG = styled.div`
  --bs-aspect-ratio: 16%;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  min-height: 120px;
`;

const Avatar = styled.div`
  background-color: #eee;
  background-size: cover;
  background-position: center;
  height: 140px;
  width: 140px;
`;

const Root = styled.div`
  font-size: 14px;

  .short-description {
    max-height: 100px;
    overflow-y: auto;

    p {
      color: #999;
    }
  }

  .profile__metadata {
    display: grid;
    grid-template-columns: 140px 1fr 240px;
    grid-gap: 2rem;
  }

  @media (max-width: 768px) {
    .profile__metadata {
      grid-template-columns: 140px 1fr;
      grid-gap: 1rem;
    }
    .profile__buttons {
      grid-column: 1 / span 2;
    }
  }

  @media (max-width: 576px) {
    .profile__metadata {
      grid-template-columns: 1fr;
    }
    .profile__buttons {
      grid-column: 1 / span 1;
    }
  }
`;

const DropdownMenu = styled("Popover.Content")`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  padding: 0.5rem;
  outline: none;

  ul {
    list-style: none;
    display: block;
    margin: 0;
    padding: 0;
  }

  li {
    display: block;
  }

  a {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.5rem;
    font: var(--text-base);
    color: var(--sand12);
    outline: none;
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  i {
    color: var(--violet8);
  }
`;

const clickbaitPrompt = `
Join the ${profile.name || daoId} DAO on the BOS
\n#NEAR #BOS #DAO\n
https://near.org/${currentLink}
`;

const twitterUrl = new URL("https://twitter.com/intent/tweet");
twitterUrl.searchParams.set("text", clickbaitPrompt);

const mailtoUrl = new URL("mailto:");
mailtoUrl.searchParams.set(
  "subject",
  `Join the ${profile.name || daoId} DAO on the BOS`,
);
mailtoUrl.searchParams.set(
  "body",
  `Take a look at this DAO. \n https://near.org/${currentLink}`,
);

return (
  <Root>
    <BG
      className="ratio rounded-4 mb-3"
      style={{
        backgroundImage: profile?.backgroundImage.ipfs_cid
          ? `url(https://ipfs.near.social/ipfs/${profile?.backgroundImage.ipfs_cid})`
          : `url(${profile?.backgroundImage})`,
      }}
      aria-label="DAO Cover Image"
      role="img"
    ></BG>

    <div className="profile__metadata">
      <Avatar
        className="avatar rounded-4 border border-2 border-white ratio ratio-1x1 position-relative z-1"
        style={{
          backgroundImage: profile?.image.ipfs_cid
            ? `url(https://ipfs.near.social/ipfs/${profile?.image.ipfs_cid})`
            : `url(${profile?.image})`,
        }}
      ></Avatar>
      <div>
        <h2 className="fw-bolder mb-0">{profile.name || daoId}</h2>
        <p
          className="mb-1"
          style={{
            color: "#4498E0",
          }}
        >
          @{daoId}
        </p>
        <div className="short-description mb-2">
          <Markdown text={profile.description} />
        </div>
        <div className="d-flex gap-3 flex-wrap mb-3">
          <a href={`/${currentLink}&tab=following`}>
            <b>{followingCount === null ? "--" : followingCount}</b> following
          </a>
          <span>|</span>
          <a href={`/${currentLink}&tab=followers`}>
            <b>{followersCount === null ? "--" : followersCount}</b> followers
          </a>
        </div>
        {profile.linktree && (
          <ul className="d-flex list-unstyled gap-3 flex-wrap">
            {profile.linktree.website && (
              <a href={`https://${profile.linktree.website}`} target="_blank">
                <i className="bi bi-globe"></i> {profile.linktree.website}
              </a>
            )}

            {profile.linktree.github && (
              <a
                href={`https://github.com/${profile.linktree.github}`}
                target="_blank"
              >
                <i className="bi bi-github"></i> {profile.linktree.github}
              </a>
            )}

            {profile.linktree.twitter && (
              <a
                href={`https://twitter.com/${profile.linktree.twitter}`}
                target="_blank"
              >
                <i className="bi bi-twitter"></i> {profile.linktree.twitter}
              </a>
            )}

            {profile.linktree.telegram && (
              <a
                href={`https://t.me/${profile.linktree.telegram}`}
                target="_blank"
              >
                <i className="bi bi-telegram"></i> {profile.linktree.telegram}
              </a>
            )}
          </ul>
        )}
      </div>

      <div className="profile__buttons w-100 d-flex flex-column gap-2">
        <Widget
          src="/*__@replace:nui__*//widget/Social.FollowButton"
          props={{
            accountId: daoId,
            variant: "info",
            className: "w-100",
          }}
        />
        <Widget
          src="/*__@replace:nui__*//widget/Input.Button"
          props={{
            variant: "info outline",
            className: "w-100",
            children: "See more details",
          }}
        />
        <div className="d-flex gap-2 mb-4">
          <Widget
            src="nearui.near/widget/Layout.Modal"
            props={{
              toggleContainerProps: {
                className: "w-100",
              },
              toggle: (
                <Widget
                  src="/*__@replace:nui__*//widget/Input.Button"
                  props={{
                    variant: "info outline",
                    className: "w-100",
                    children: "Ask to join",
                  }}
                />
              ),
              content: (
                <div className="ndc-card p-4">
                  <Widget
                    src="nearui.near/widget/Input.Select"
                    props={{
                      label: "Role you want to join as",
                      options: roles.map((r) => {
                        return {
                          title: r,
                          value: r,
                        };
                      }),
                      onChange: (v) => State.update({ joinRole: v }),
                      value: state.joinRole,
                    }}
                  />
                  <Widget
                    src="nearui.near/widget/Input.Button"
                    props={{
                      children: "Propose to Join",
                      size: "sm",
                      variant: ["info"],
                      className: "w-100 mt-3",
                      onClick: () =>
                        onAddUserProposal(accountId, state.joinRole),
                    }}
                  />
                </div>
              ),
            }}
          />
          <Popover.Root>
            <Popover.Trigger asChild>
              <div className="w-100">
                <Widget
                  src="/*__@replace:nui__*//widget/Input.Button"
                  props={{
                    variant: "info outline",
                    className: "w-100",
                    children: "Share",
                  }}
                />
              </div>
            </Popover.Trigger>

            <DropdownMenu sideOffset={5}>
              <ul>
                <li>
                  <Popover.Close asChild>
                    <a href={mailtoUrl.toString()} target="_blank">
                      <i
                        className="bi bi-envelope"
                        style={{ color: "#4498E0" }}
                      />{" "}
                      Share by email
                    </a>
                  </Popover.Close>
                </li>
                <li>
                  <Popover.Close asChild>
                    <a href={twitterUrl.toString()} target="_blank">
                      <i
                        className="bi bi-twitter"
                        style={{ color: "#4498E0" }}
                      />
                      Share on Twitter
                    </a>
                  </Popover.Close>
                </li>
              </ul>

              <Popover.Arrow style={{ fill: "#fff" }} />
            </DropdownMenu>
          </Popover.Root>
        </div>
      </div>
    </div>
  </Root>
);
