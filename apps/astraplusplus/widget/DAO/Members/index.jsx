const daoId = props.daoId;
const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const baseApi = "https://api.pikespeak.ai";
let voters = [];

function fetchVotes() {
    const res = fetch(`${baseApi}/daos/votes/${daoId}`, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": publicApiKey
        }
    });
    if (res?.body?.length) {
        res?.body?.map((item) => {
            item.voters?.map((voterData) => {
                const accountIndex = voters.findIndex(
                    (d) => d.account === voterData.account
                );
                if (accountIndex !== -1) {
                    voters[accountIndex] = {
                        ...voters[accountIndex],
                        rejected:
                            voters[accountIndex].rejected + voterData.rejected,
                        approve:
                            voters[accountIndex].approve + voterData.approve
                    };
                } else {
                    const userSBTs = Near.view(
                        "registry.i-am-human.near",
                        "is_human",
                        {
                            account: voterData.account
                        }
                    );
                    let isHuman = false;
                    if (userSBTs) {
                        userSBTs.forEach((sbt) => {
                            if ("fractal.i-am-human.near" === sbt[0]) {
                                isHuman = true;
                            }
                        });
                    }
                    const followEdge = Social.keys(
                        `${context.accountId}/graph/follow/${voterData.account}`,
                        undefined,
                        {
                            values_only: true
                        }
                    );
                    voters.push({
                        ...voterData,
                        isHuman: isHuman,
                        isUserFollowed: Object.keys(followEdge || {}).length > 0
                    });
                }
            });
        });
    }
}

fetchVotes();

const processPolicy = (policy) => {
    const obj = {
        policy,
        users: {},
        roles: {},
        everyone: {}
    };
    policy.roles.forEach((role) => {
        if (role.kind === "Everyone") {
            obj.everyone = role;
        }
        if (role.kind.Group) {
            if (!obj.roles[role.name]) {
                obj.roles[role.name] = role;
            }
            role.kind.Group.forEach((user) => {
                if (!obj.users[user]) {
                    obj.users[user] = [];
                }

                obj.users[user].push(role.name);
            });
        }
    });

    return obj;
};

const policy = useCache(
    () =>
        Near.asyncView(daoId, "get_policy").then((policy) =>
            processPolicy(policy)
        ),
    daoId + "-processed_policy",
    { subscribe: false }
);

if (policy === null) return "";

const Wrapper = styled.div`
    .userRow {
        width: 100%;
        @media screen and (min-width: 600px) {
            width: calc(50% - 1rem);
        }
        @media screen and (min-width: 1400px) {
            width: calc(33% - 1rem);
        }
    }
`;

return (
    <div>
        <Wrapper className="d-flex flex-column gap-4">
            <Widget
                src="/*__@appAccount__*//widget/DAO.Members.MembersGroup"
                props={{
                    data: voters,
                    policy: policy
                }}
            />
        </Wrapper>
    </div>
);
