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
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: 0.9rem;
        padding: 20px 10px 10px;
        gap: 1em;
        border-radius: 14px;

        & > div:last-child {
            text-align: end;
        }
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
                        <div>
                            <Widget
                                src="mob.near/widget/Profile.ShortInlineBlock"
                                props={{
                                    accountId: voterId
                                }}
                            />
                        </div>
                        <div>
                            voted
                            <span className="vote">{vote}</span>
                        </div>
                    </li>
                    {isCongressDaoID && (
                        <div className="p-3 d-flex gap-2">
                            <p>Time: </p>
                            {new Date(
                                votes[voterId].timestamp
                            ).toLocaleString()}
                        </div>
                    )}
                </div>
            );
        })}
    </Wrapper>
);
