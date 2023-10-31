const {
    id,
    typeName,
    proposer,
    description,
    kind,
    statusName,
    totalVotesNeeded,
    totalVotes,
    submission_time,
    votes
} = props.proposal;
const {
    daoId,
    isAllowedToVote,
    multiSelectMode,
    proposal,
    policy,
    handleVote,
    handlePreVoteAction,
    comments,
    isCongressDaoID,
    isVotingBodyDao,
    daoConfig,
    isHuman,
    currentuserCongressHouse
} = props;
const accountId = context.accountId;

function checkVotesForCongressDao(value) {
    if (isCongressDaoID) {
        return votes[accountId]?.vote === value;
    } else {
        return votes[accountId || ";;;"] === value;
    }
}

// TODO: implement category
const category = "";

const Wrapper = styled.div`
    margin: 16px auto;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 500px;
    width: 100%;
    border: 1px solid #fff;

    .word-wrap {
        word-wrap: break-word;
    }

    ${({ status }) =>
        status === "Approved" &&
        `
    border-color: #82E299;
  `}

    ${({ status }) =>
        status === "In Progress" &&
        `
    border-color: #fff;
  `}

  ${({ status }) =>
        (status === "Failed" || status === "Rejected") &&
        `
    border-color: #C23F38;
  `}

  .text-muted {
        color: #8c8c8c !important;
    }

    /* Tooltip container */
    .custom-tooltip {
        position: relative;
        display: inline-block;
    }

    /* Tooltip text */
    .custom-tooltip .tooltiptext {
        visibility: hidden;
        width: auto;
        background-color: #555;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;

        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 0%;

        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 0.3s;
    }

    /* Tooltip arrow */
    .custom-tooltip .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .custom-tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }
`;

const cls = (c) => c.join(" ");

function renderPermission({ isAllowedToVote }) {
    return (
        <div
            className={"text-center p-2 rounded-pill"}
            style={{
                backgroundColor: isAllowedToVote ? "#82E29926" : "#C23F381A"
            }}
        >
            {isAllowedToVote
                ? "You are allowed to vote on this proposal"
                : "You are not allowed to vote on this proposal"}
        </div>
    );
}

const execProposal = ({ daoId, id }) =>
    Near.call(daoId, "execute", { id }, 300000000000000);

const slashPreVoteProposal = ({ id }) =>
    Near.call(daoId, "slash_prevote_proposal", { id }, 300000000000000);

function renderHeader({ typeName, id, daoId, statusName }) {
    let statusicon;
    let statustext;
    let statusvariant;

    switch (statusName) {
        case "Approved":
        case "Accepted":
            statusicon = "bi bi-check-circle";
            statustext = "Proposal " + statusName;
            statusvariant = "success";
            break;
        case "Executed":
            statusicon = "bi bi-play-fill";
            statustext = "Proposal " + statusName;
            statusvariant = "success";
            break;
        case "In Progress":
        case "InProgress":
            statusicon = "spinner-border spinner-border-sm";
            statustext = "Proposal In Progress";
            statusvariant = "primary";
            break;
        case "Vetoed":
            statusicon = "bi bi-x-circle";
            statustext = "Proposal Vetoed";
            statusvariant = "black";
            break;
        case "Expired":
            statusicon = "bi bi-clock";
            statustext = "Proposal Expired";
            statusvariant = "black";
            break;
        case "Failed":
            statusicon = "bi bi-x-circle";
            statustext = "Proposal Failed";
            statusvariant = "black";
            break;
        case "Rejected":
            statusicon = "bi bi-ban";
            statustext = "Proposal Rejected";
            statusvariant = "danger";
            break;
        case "PreVote":
        case "Pre Vote":
            statusicon = "bi bi-hourglass-split";
            statustext = "Pre Vote";
            statusvariant = "disabled";
            break;
    }

    return (
        <div className="card__header">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                    <div className="d-flex gap-2">
                        <h4 className="h4 d-flex align-items-center gap-2">
                            {typeName}
                            <Widget
                                src="/*__@replace:nui__*//widget/Element.Badge"
                                props={{
                                    children: `Proposal ID #${id}`,
                                    variant: `outline info round`,
                                    size: "md"
                                }}
                            />
                            {(isCongressDaoID || isVotingBodyDao) &&
                                statusName === "Approved" &&
                                proposal?.submission_time +
                                    daoConfig?.voting_duration +
                                    (daoConfig?.cooldown ?? 0) < // cooldown is not available in vb
                                    Date.now() && (
                                    <Widget
                                        src="nearui.near/widget/Input.Button"
                                        props={{
                                            variant: "primary icon",
                                            children: (
                                                <i class="bi bi-caret-right-fill" />
                                            ),
                                            onClick: () =>
                                                execProposal({ daoId, id })
                                        }}
                                    />
                                )}
                            {isVotingBodyDao && statusName === "Spam" && (
                                <Widget
                                    src="nearui.near/widget/Input.Button"
                                    props={{
                                        variant: "danger",
                                        children: "Slash",
                                        onClick: () =>
                                            execProposal({ daoId, id })
                                    }}
                                />
                            )}
                            {isVotingBodyDao &&
                                statusName === "PreVote" &&
                                proposal?.submission_time +
                                    daoConfig?.pre_vote_duration <
                                    Date.now() && (
                                    <Widget
                                        src="nearui.near/widget/Input.Button"
                                        props={{
                                            variant: "danger",
                                            children: "Slash",
                                            onClick: () =>
                                                slashPreVoteProposal({
                                                    id
                                                })
                                        }}
                                    />
                                )}
                        </h4>
                    </div>
                </div>
                <div>
                    <Widget
                        src="/*__@replace:nui__*//widget/Element.Badge"
                        props={{
                            children: (
                                <>
                                    <i
                                        className={statusicon}
                                        style={{
                                            fontSize: "18px",
                                            marginRight: "5px",
                                            borderWidth: "2px",
                                            animationDuration: "8s"
                                        }}
                                    ></i>
                                    {statustext}
                                </>
                            ),
                            variant: `${statusvariant} round`,
                            size: "lg"
                        }}
                    />
                </div>
            </div>
            <h6 className="text-secondary">{daoId}</h6>
        </div>
    );
}

function renderData({
    proposer,
    category,
    description,
    submission_time,
    totalVotesNeeded
}) {
    return (
        <div className="d-flex gap-3 flex-column">
            <div className="d-flex gap-3">
                <div className="w-50">
                    <div className="mb-2">
                        <b>Proposer</b>
                    </div>
                    <Widget
                        src="/*__@replace:nui__*//widget/Element.User"
                        props={{ accountId: proposer }}
                    />
                </div>
                {category && (
                    <div className="w-50">
                        <h5 className="text-muted h6">Category</h5>
                        <Widget
                            src="/*__@replace:nui__*//widget/Element.Badge"
                            props={{
                                children: category,
                                variant: `disabled round`,
                                size: "lg"
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="mt-4 word-wrap">
                <b>Description</b>
                <Markdown text={description} />
            </div>
            <div>
                <Widget
                    src="/*__@appAccount__*//widget/Common.Modals.ProposalArguments"
                    props={{
                        daoId,
                        proposal
                    }}
                />
            </div>
            <div className="d-flex gap-5 flex-wrap">
                {submission_time && (
                    <div>
                        <b>Submission date</b>
                        <p>
                            <small>
                                {isCongressDaoID || isVotingBodyDao
                                    ? new Date(submission_time).toLocaleString()
                                    : new Date(
                                          parseInt(
                                              Big(submission_time).div(1000000)
                                          )
                                      ).toLocaleString()}
                            </small>
                        </p>
                    </div>
                )}
                {(isCongressDaoID || isVotingBodyDao) && (
                    <div>
                        <b>Expiration date</b>
                        <p>
                            <small>
                                {new Date(
                                    submission_time + daoConfig?.voting_duration
                                ).toLocaleString()}
                            </small>
                        </p>
                    </div>
                )}
                {totalVotesNeeded && (
                    <div>
                        <b>Total Votes Required</b>
                        <p>
                            <small>{totalVotesNeeded}</small>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function renderVoteButtons({
    totalVotes,
    statusName,
    votes,
    accountId,
    isAllowedToVote,
    handleVote
}) {
    const VoteButton = styled.button`
    width: 100%;
    border-radius: 15px;
    border: 1px solid transparent;
    padding: 0 20px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    color: rgb(var(--vote-button-color));

    --vote-button-bg: 130, 226, 153;
    --vote-button-color: 0, 0, 0;

    &.no {
      --vote-button-bg: 194, 63, 56;
      --vote-button-color: 255, 255, 255;
    }

    &.no > div:last-child {
      color: #000;
      transition: all 0.4s ease-in-out;
    }
    ${({ finsihed, percentage, disabled }) => {
        if (finsihed) {
            if (percentage > 80) {
                return `
        &.no > div:last-child {
          color: rgb(var(--vote-button-color)) !important;
        }
      `;
            }
        } else if (!disabled) {
            return `
        &:hover.no > div:last-child {
          color: rgb(var(--vote-button-color)) !important;
        } 
        `;
        }
    }}}

    &.spam {
      --vote-button-bg: 245, 197, 24;
      display :flex;
      justify-content: center;
    }

    &.abstain {
        --vote-button-bg: 169, 169, 169;
      }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 12px;
      transition: all 0.4s ease-in-out;
      z-index: 0;
      background-color: rgb(var(--vote-button-bg));
      ${({ percentage }) => `
        min-width: ${
            percentage && percentage > 25 ? `${percentage}%` : "120px" // with less than 25% the width is less than 120px
        };
      `}
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 12px;
      transition: all 0.4s ease-in-out;
      z-index: 1;
      background-color: var(--vote-button-bg);

      min-width: ${({ percentage }) =>
          percentage && percentage > 25 ? `${percentage}%` : "120px"};

      ${({ finsihed, wins }) =>
          finsihed &&
          wins &&
          `
        display: none;
      `}
    }

    ${({ disabled }) =>
        !disabled &&
        `
    &:hover {
      &:before {
        min-width: 100%;
      }
    }
  `}

    & > div {
      z-index: 2;
    }

    & > div:last-child span {
      display: block;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;

      &:last-child {
        font-size: 12px;
        font-weight: 400;
      }
    }
  `;

    const percentages = {
        yes: Math.round((totalVotes.yes / totalVotesNeeded) * 100) || 0,
        no: Math.round((totalVotes.no / totalVotesNeeded) * 100) || 0,
        spam: Math.round((totalVotes.spam / totalVotesNeeded) * 100) || 0,
        abstain: Math.round((totalVotes.abstain / totalVotesNeeded) * 100) || 0
    };

    const wins = {
        yes: statusName === "Approved",
        no: statusName === "Rejected",
        spam: statusName === "Failed" || statusName === "Spam",
        abstain: statusName === "Failed"
    };

    const finsihed = statusName !== "In Progress";

    const voted = {
        yes: checkVotesForCongressDao("Approve"),
        no: checkVotesForCongressDao("Reject"),
        spam: isVotingBodyDao
            ? checkVotesForCongressDao("Spam")
            : checkVotesForCongressDao("Remove"),
        abstain: checkVotesForCongressDao("Abstain")
    };

    const alreadyVoted = voted.yes || voted.no || voted.spam || voted.abstain;

    return (
        <div
            className="d-lg-grid d-flex flex-wrap gap-2 align-items-end"
            style={{
                gridTemplateColumns: isVotingBodyDao
                    ? "1fr 1fr 1fr 120px"
                    : isCongressDaoID
                    ? "1fr 1fr 1fr"
                    : "1fr 1fr 120px"
            }}
        >
            <div className="w-100">
                {voted.yes && (
                    <Widget
                        src="/*__@replace:nui__*//widget/Element.Badge"
                        props={{
                            size: "sm",
                            variant: "info outline mb-1",
                            children: "You voted"
                        }}
                    />
                )}
                <VoteButton
                    className="yes"
                    percentage={percentages.yes}
                    finsihed={finsihed}
                    wins={wins.yes}
                    myVote={voted.yes}
                    onClick={() => handleVote("VoteApprove")}
                    disabled={alreadyVoted || finsihed || !isAllowedToVote[0]}
                >
                    <div>
                        {wins.yes && (
                            <span title="Yes won">
                                <i className="bi bi-check-circle"></i>
                            </span>
                        )}
                        <span>Yes</span>
                        <i className="bi bi-hand-thumbs-up"></i>
                    </div>

                    <div>
                        <span>
                            {percentages.yes}
                            <i className="bi bi-percent"></i>
                        </span>
                        <span>{totalVotes.yes} Votes</span>
                    </div>
                </VoteButton>
            </div>
            <div className="w-100">
                {voted.no && (
                    <Widget
                        src="/*__@replace:nui__*//widget/Element.Badge"
                        props={{
                            size: "sm",
                            variant: "info outline mb-1",
                            children: "You voted"
                        }}
                    />
                )}
                <VoteButton
                    className="no"
                    percentage={percentages.no}
                    finsihed={finsihed}
                    wins={wins.no}
                    myVote={voted.no}
                    onClick={() => handleVote("VoteReject")}
                    disabled={alreadyVoted || finsihed || !isAllowedToVote[1]}
                >
                    <div className="d-flex gap-2 align-items-center">
                        {wins.no && (
                            <span title="No won">
                                <i className="bi bi-check-circle"></i>
                            </span>
                        )}
                        <span>No</span>
                        <i className="bi bi-hand-thumbs-down"></i>
                    </div>

                    <div>
                        <span>
                            {percentages.no}
                            <i className="bi bi-percent"></i>
                        </span>
                        <span>{totalVotes.no} Votes</span>
                    </div>
                </VoteButton>
            </div>
            {(isVotingBodyDao || isCongressDaoID) && (
                <div className="w-100">
                    {voted.abstain && (
                        <Widget
                            src="/*__@replace:nui__*//widget/Element.Badge"
                            props={{
                                size: "sm",
                                variant: "info outline mb-1",
                                children: "You voted"
                            }}
                        />
                    )}

                    <VoteButton
                        className="abstain"
                        percentage={percentages.abstain}
                        finsihed={finsihed}
                        wins={wins.abstain}
                        myVote={voted.abstain}
                        onClick={() => handleVote("VoteAbstain")}
                        disabled={
                            alreadyVoted || finsihed || !isAllowedToVote[2]
                        }
                    >
                        <div className="d-flex gap-2 align-items-center">
                            <span>Abstain</span>
                        </div>
                        <div>
                            <span>
                                {percentages.abstain}
                                <i className="bi bi-percent"></i>
                            </span>
                            <span>{totalVotes.abstain} Votes</span>
                        </div>
                    </VoteButton>
                </div>
            )}
            {!isCongressDaoID && (
                <div className="w-100">
                    {voted.spam && (
                        <Widget
                            src="/*__@replace:nui__*//widget/Element.Badge"
                            props={{
                                size: "sm",
                                variant: "info outline mb-1",
                                children: "You voted"
                            }}
                        />
                    )}

                    <VoteButton
                        className="spam"
                        percentage={percentages.spam}
                        finsihed={finsihed}
                        wins={wins.spam}
                        myVote={voted.spam}
                        onClick={() =>
                            handleVote(
                                isVotingBodyDao ? "VoteSpam" : "VoteRemove"
                            )
                        }
                        disabled={
                            alreadyVoted || finsihed || !isAllowedToVote[2]
                        }
                    >
                        <div>
                            <span>Spam</span>
                        </div>
                        <div></div>
                    </VoteButton>
                </div>
            )}
        </div>
    );
}

function renderMultiVoteButtons({ daoId, proposal, canVote }) {
    return (
        <Widget
            src="/*__@appAccount__*//widget/DAO.Proposals.MultiVote"
            props={{
                daoId,
                proposal,
                canVote,
                view: "multiVote",
                isCongressDaoID,
                isVotingBodyDao,
                dev: props.dev
            }}
        />
    );
}

function renderPreVoteButtons({ proposal }) {
    const voted = proposal?.supported?.includes(accountId);
    return (
        <div
            className="d-lg-grid d-flex flex-wrap gap-2 align-items-end"
            style={{ gridTemplateColumns: "repeat(3,1fr)" }}
        >
            <button
                class="custom-tooltip btn btn-primary"
                disabled={currentuserCongressHouse === null}
                onClick={() =>
                    handlePreVoteAction({
                        action: "support_proposal_by_congress",
                        proposalId: proposal.id
                    })
                }
            >
                <span class="tooltiptext">
                    This proposal requires a Congressional member to support in
                    order to move into the active status.
                </span>
                Congress Member UpVote
            </button>
            <div className="d-flex flex-column gap-1">
                <div style={{ width: "fit-content" }}>
                    {voted && (
                        <Widget
                            src="/*__@replace:nui__*//widget/Element.Badge"
                            props={{
                                size: "sm",
                                variant: "info outline mb-1",
                                children: "You voted"
                            }}
                        />
                    )}
                </div>
                <button
                    class="custom-tooltip btn btn-primary"
                    disabled={!isHuman || voted}
                    onClick={() =>
                        handlePreVoteAction({
                            action: "support_proposal",
                            proposalId: proposal.id
                        })
                    }
                >
                    <span class="tooltiptext">
                        This proposal requires a minimal support from 50 members
                        in order to move into the active status.
                    </span>
                    Voting Body Support
                </button>
            </div>
            <button
                class="custom-tooltip btn btn-primary"
                onClick={() =>
                    handlePreVoteAction({
                        action: "top_up_proposal",
                        proposalId: proposal.id
                    })
                }
            >
                <span class="tooltiptext">
                    This proposal requires additional bond to support in order
                    to move into the active status.
                </span>
                Bond to move to Active Status
            </button>
        </div>
    );
}

function renderFooter({ totalVotes, votes, comments, daoId, proposal }) {
    const items = [
        {
            title: "Comments",
            icon: "bi bi-chat-left-text",
            count: comments.length || 0,
            widget: "Common.Modals.Comments",
            props: {
                daoId,
                proposal,
                commentsCount: comments.length,
                item: {
                    type: "dao_proposal_comment",
                    path: `${daoId}/proposal/main`,
                    proposal_id: proposal.id + "-beta"
                }
            }
        },
        {
            title: "Voters",
            icon: "bi bi-people",
            count: totalVotes.total,
            widget: "Common.Modals.Voters",
            props: {
                daoId,
                votes,
                totalVotes,
                isCongressDaoID
            }
        },
        {
            title: "Share",
            icon: "bi bi-share",
            widget: "Common.Modals.Share",
            props: {
                url: `https://near.org//*__@appAccount__*//widget/home?page=dao&tab=proposals&daoId=${daoId}&proposalId=${proposal.id}`,
                text: "Explore this new proposal from our DAO! Your support and feedback are essential as we work towards a decentralized future. Review the details and join the discussion here:"
            }
        },
        {
            title: "More details",
            icon: "bi bi-three-dots",
            widget: "Common.Modals.ProposalArguments",
            props: {
                daoId,
                proposal,
                showCard: true
            }
        }
    ];

    const renderModal = (item, index) => {
        return (
            <Widget
                src="/*__@replace:nui__*//widget/Layout.Modal"
                props={{
                    content: (
                        <Widget
                            src={`/*__@appAccount__*//widget/${item.widget}`}
                            props={item.props}
                        />
                    ),
                    toggle: (
                        <div
                            key={index}
                            className={
                                "d-flex gap-2 align-items-center justify-content-center user-select-none" +
                                (index !== items.length - 1
                                    ? " border-end"
                                    : "")
                            }
                        >
                            <i
                                className={item.icon}
                                style={{ color: "#4498E0" }}
                            ></i>
                            {item.count && <span>{item.count}</span>}
                            <span>{item.title}</span>
                        </div>
                    ),
                    toggleContainerProps: {
                        className: "flex-fill"
                    }
                }}
            />
        );
    };

    return (
        <div className="d-flex gap-3 justify-content-between mt-2 border-top pt-4 flex-wrap">
            {items.map(renderModal)}
        </div>
    );
}

const voted = {
    yes: checkVotesForCongressDao("Approve"),
    no: checkVotesForCongressDao("Reject"),
    spam: isVotingBodyDao
        ? checkVotesForCongressDao("Spam")
        : checkVotesForCongressDao("Remove"),
    abstain: checkVotesForCongressDao("Abstain")
};

const alreadyVoted = voted.yes || voted.no || voted.spam;

const canVote =
    isAllowedToVote.every((v) => v) &&
    statusName === "In Progress" &&
    !alreadyVoted;

const showMultiVote = multiSelectMode && canVote;

if (multiSelectMode && !canVote) {
    let reason = "";

    if (!isAllowedToVote.every((v) => v)) {
        reason = "you don't have permissions to vote";
    }
    if (statusName !== "In Progress") {
        reason = `it's already ${statusName}`;
    }
    if (alreadyVoted) {
        reason = ` you've already voted ${votes[accountId]}`;
    }

    return (
        <div>
            Hiding #{id} because {reason}
        </div>
    );
}

return (
    <Wrapper className="ndc-card" status={statusName}>
        {renderPermission({ isAllowedToVote: isAllowedToVote.every((v) => v) })}
        {renderHeader({ typeName, id, daoId, statusName })}
        {renderData({
            proposer,
            category,
            description,
            submission_time,
            totalVotesNeeded
        })}
        {!!showMultiVote &&
            renderMultiVoteButtons({
                daoId,
                proposal,
                canVote
            })}

        {statusName !== "Pre Vote" &&
            !showMultiVote &&
            renderVoteButtons({
                totalVotes,
                statusName,
                votes,
                accountId,
                isAllowedToVote,
                handleVote: (action) => {
                    return handleVote({
                        action,
                        daoId,
                        proposalId: proposal.id
                    });
                }
            })}

        {statusName === "Pre Vote" &&
            renderPreVoteButtons({
                proposal
            })}
        {renderFooter({
            totalVotes,
            votes,
            comments,
            daoId,
            proposal
        })}
    </Wrapper>
);
