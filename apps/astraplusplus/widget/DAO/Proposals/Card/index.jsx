const multiSelectMode = props.multiSelectMode ?? false;
const { proposalString, proposalId, daoId } = props;
const accountId = context.accountId;

const proposal = proposalString ? JSON.parse(proposalString) : null;

const policy = Near.view(daoId, "get_policy");
let roles = policy;

if (roles === null)
  return (
    <Widget src="/*__@appAccount__*//widget/DAO.Proposals.Card.skeleton" />
  );

let new_proposal = null;
if (!proposalString && proposalId && daoId) {
  // TODO: THIS API IS SO WEIRD AND INCONSISTENT WITH PROPOSALS API, VOTE IS BROKEN
  new_proposal = fetch(
    `https://api.pikespeak.ai/daos/proposal/${daoId}?id=${proposalId}`,
    {
      mode: "cors",
      headers: {
        "x-api-key": "/*__@replace:pikespeakApiKey__*/",
      },
    },
  );
  if (new_proposal === null) {
    return (
      <Widget src="/*__@appAccount__*//widget/DAO.Proposals.Card.skeleton" />
    );
  } else if (!new_proposal.ok) {
    return "Proposal not found, check console for details.";
  }
  new_proposal = new_proposal.body[0].proposal;
} else if (!proposalString) {
  return "Please provide a daoId and a proposal or proposalId.";
}

const expensiveWork = () => {
  let my_proposal = new_proposal ? new_proposal : proposal;

  // --- check user permissions
  const proposalKinds = {
    ChangeConfig: "config",
    ChangePolicy: "policy",
    AddMemberToRole: "add_member_to_role",
    RemoveMemberFromRole: "remove_member_from_role",
    FunctionCall: "call",
    UpgradeSelf: "upgrade_self",
    UpgradeRemote: "upgrade_remote",
    Transfer: "transfer",
    SetStakingContract: "set_vote_token",
    AddBounty: "add_bounty",
    BountyDone: "bounty_done",
    Vote: "vote",
    FactoryInfoUpdate: "factory_info_update",
    ChangePolicyAddOrUpdateRole: "policy_add_or_update_role",
    ChangePolicyRemoveRole: "policy_remove_role",
    ChangePolicyUpdateDefaultVotePolicy: "policy_update_default_vote_policy",
    ChangePolicyUpdateParameters: "policy_update_parameters",
  };

  const actions = {
    AddProposal: "AddProposal",
    VoteApprove: "VoteApprove",
    VoteReject: "VoteReject",
    VoteRemove: "VoteRemove",
  };

  // -- Get all the roles from the DAO policy
  roles = roles === null ? [] : roles.roles;

  // -- Filter the user roles
  const userRoles = [];
  for (const role of roles) {
    if (role.kind === "Everyone") {
      userRoles.push(role);
      continue;
    }
    if (!role.kind.Group) continue;
    if (accountId && role.kind.Group && role.kind.Group.includes(accountId)) {
      userRoles.push(role);
    }
  }

  const isAllowedTo = (kind, action) => {
    // -- Check if the user is allowed to perform the action
    let allowed = false;
    userRoles
      .filter(({ permissions }) => {
        const allowedRole =
          permissions.includes(`${kind.toString()}:${action.toString()}`) ||
          permissions.includes(`${kind.toString()}:*`) ||
          permissions.includes(`*:${action.toString()}`) ||
          permissions.includes("*:*");
        allowed = allowed || allowedRole;
        return allowedRole;
      })
      .map((role) => role.name);
    return allowed;
  };

  const kindName =
    typeof my_proposal.kind === "string"
      ? my_proposal.kind
      : typeof my_proposal.kind.typeEnum === "string"
      ? my_proposal.kind.typeEnum
      : Object.keys(my_proposal.kind)[0];
  const isAllowedToVote = [
    isAllowedTo(proposalKinds[kindName], actions.VoteApprove),
    isAllowedTo(proposalKinds[kindName], actions.VoteReject),
    isAllowedTo(proposalKinds[kindName], actions.VoteRemove),
  ];
  // --- end check user permissions
  // --- Votes required:
  // TODO: Needs to be reviewed

  // Fixes pikespeak API for single proposal
  Object.keys(my_proposal.vote_counts).forEach((k) => {
    if (typeof my_proposal.vote_counts[k] !== "string") return;
    my_proposal.vote_counts[k] = my_proposal.vote_counts[k]
      .match(/.{1,2}/g)
      .slice(0, 3)
      .map((a) => parseInt(a));
  });

  let totalVotesNeeded = 0;

  policy.roles.forEach((role) => {
    // Determine if the role is eligible for the given proposalType
    const isRoleAllowedToVote =
      role.permissions.includes(`${proposalKinds[kindName]}:VoteApprove`) ||
      role.permissions.includes(`${proposalKinds[kindName]}:VoteReject`) ||
      role.permissions.includes(`${proposalKinds[kindName]}:*`) ||
      role.permissions.includes(`*:VoteApprove`) ||
      role.permissions.includes(`*:VoteReject`) ||
      role.permissions.includes("*:*");

    if (isRoleAllowedToVote) {
      const threshold = (role.vote_policy &&
        role.vote_policy[proposalKinds[kindName]]?.threshold) ||
        policy["default_vote_policy"]?.threshold || [0, 0];
      const eligibleVoters = role.kind.Group ? role.kind.Group.length : 0;

      // Apply the threshold
      const votesNeeded = Math.ceil(
        (threshold[0] / threshold[1]) * eligibleVoters,
      );

      totalVotesNeeded += votesNeeded;
    }
  });

  let totalVotes = {
    yes: 0,
    no: 0,
    spam: 0,
    total: 0,
  };

  Object.keys(my_proposal.vote_counts).forEach((key) => {
    totalVotes.yes += my_proposal.vote_counts[key][0];
    totalVotes.no += my_proposal.vote_counts[key][1];
    totalVotes.spam += my_proposal.vote_counts[key][2];
  });
  totalVotes.total = totalVotes.yes + totalVotes.no + totalVotes.spam;

  my_proposal.totalVotesNeeded = totalVotesNeeded;
  my_proposal.totalVotes = totalVotes;
  // --- end Votes required

  my_proposal.typeName = kindName.replace(/([A-Z])/g, " $1").trim(); // Add spaces between camelCase
  my_proposal.statusName = my_proposal.status.replace(/([A-Z])/g, " $1").trim();

  if (!state) {
    State.init({
      proposal: my_proposal,
      isAllowedToVote,
    });
  } else {
    State.update({
      proposal: my_proposal,
      isAllowedToVote,
    });
  }
};

const comments = Social.index("comment", {
  type: "dao_proposal_comment",
  path: `${daoId}/proposal/main`,
  proposal_id: proposal.id + "-beta",
});

if (!state || state.proposal.id !== proposal.id) {
  // Only execute expensive work once
  expensiveWork();
  return multiSelectMode ? (
    ""
  ) : (
    <Widget src="/*__@appAccount__*//widget/DAO.Proposals.Card.skeleton" />
  );
}

const handleVote = ({ action, proposalId, daoId }) => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(proposalId),
        action: action,
      },
      gas: 200000000000000,
    },
  ]);
};

return (
  <Widget
    src="/*__@appAccount__*//widget/DAO.Proposals.Card.ui"
    props={{
      proposal: state.proposal,
      isAllowedToVote: state.isAllowedToVote,
      multiSelectMode,
      daoId,
      policy,
      comments: comments,
      handleVote,
    }}
  />
);
