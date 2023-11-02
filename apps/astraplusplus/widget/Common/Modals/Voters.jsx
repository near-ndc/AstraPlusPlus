const votes = props.votes;
const isCongressDaoID = props.isCongressDaoID;

const Wrapper = styled.ul`
    background: #f8f9fa;
    border-radius: 14px;
    overflow: hidden;
    padding: 24px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .radius {
        border-radius: 14px;
    }

    li {
        display: flex;
        flex-direction: column;
        padding: 12px;
        gap: 10px;
        border-radius: 14px;
    }

    div.Approve {
        background-color: #59e69220;
        .vote {
            color: #0d562b;
        }
    }
    div.Reject {
        background-color: #e5484d20;
        .vote {
            color: #bf2c30;
        }
    }
    div.Abstain {
        background-color: #d3d3d3;
        .vote {
            color: black;
        }
    }
    div.Spam {
        background-color: #ffda0920;
        .vote {
            color: #73692d;
        }
    }
    div.Remove {
        background-color: #ffda0920;
        .vote {
            color: #73692d;
        }
    }
`;

return (
    <Wrapper>
        {Object.keys(votes).length === 0 && (
            <span className="text-muted text-center">No votes yet</span>
        )}
        {Object.keys(votes).map((voterId) => {
            const vote = isCongressDaoID ? votes[voterId].vote : votes[voterId];
            return (
                <div className={vote + " radius"}>
                    <li className={vote}>
                        <div className="d-flex items-center justify-content-between">
                            <div>
                                <Widget
                                    src="mob.near/widget/Profile.ShortInlineBlock"
                                    props={{
                                        accountId: voterId,
                                        tooltip: true
                                    }}
                                />
                            </div>
                            <Widget
                                src="/*__@replace:nui__*//widget/Element.Badge"
                                props={{
                                    children: (
                                        <span className="vote">{vote}</span>
                                    ),
                                    variant: `round`,
                                    size: "md"
                                }}
                            />
                        </div>
                        {isCongressDaoID && votes[voterId].timestamp > 0 && (
                            <div className="d-flex gap-2">
                                <small>
                                    <i className="bi bi-clock" />
                                </small>
                                <small className="text-secondary">
                                    {new Date(
                                        votes[voterId].timestamp
                                    ).toLocaleString()}
                                </small>
                            </div>
                        )}
                    </li>
                </div>
            );
        })}
    </Wrapper>
);
