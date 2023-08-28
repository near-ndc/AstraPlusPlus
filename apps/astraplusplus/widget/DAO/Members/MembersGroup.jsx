const data = props.data;
const policy = props.policy;

const rolesArray = Object.keys(policy?.roles ?? {});

const colorsArray = ["blue", "green", "pink", "red"];

const RolesColor = rolesArray.map((item, i) => {
    return { color: colorsArray[i], role: item };
});

const onRemoveUserProposal = (memberId, roleId) => {
    Near.call([
        {
            contractName: daoId,
            methodName: "add_proposal",
            args: {
                proposal: {
                    description: "Remove DAO member",
                    kind: {
                        RemoveMemberFromRole: {
                            member_id: memberId,
                            role: roleId ?? "council"
                        }
                    }
                }
            },
            gas: 219000000000000,
            deposit: policy.policy.proposal_bond
        }
    ]);
};

const viewTypes = {
    CARD: "Card",
    LIST: "List",
    GROUP: "Group"
};

const viewList = [
    {
        label: "Group View",
        value: viewTypes.GROUP
    },
    {
        label: "List View",
        value: viewTypes.LIST
    },
    {
        label: "Card View",
        value: viewTypes.CARD
    }
];

const groupTypes = {
    ASCENDING: "Ascending",
    DESCENDING: "Descending"
};

const filterlist =
    [...rolesArray, groupTypes.ASCENDING, groupTypes.DESCENDING] ?? [];

State.init({
    filtersOpen: false,
    selectedView: viewTypes.GROUP,
    viewModalOpen: false,
    filters: [],
    expandedTables: {},
    isLoading: false,
    search: "",
    filteredData: [],
    removeFromRole: null
});

const Wrapper = styled.div`
    border: 1px solid transparent;

    a {
        color: #4498e0;
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;

        &:hover {
            color: #4498e0cc;
        }
    }

    .custom-tag {
        border-top-right-radius: 9999px;
        border-bottom-right-radius: 9999px;
        border-top-left-radius: 9999px;
        border-bottom-left-radius: 9999px;
        padding-inline: 0.8rem;
        padding-block: 0.3rem;
        display: flex;
        gap: 0.5rem;
        border-width: 1px;
        border-style: solid;
        font-size: 13px;
    }

    .blue-bg {
        background-color: rgba(68, 152, 224, 0.1);
        color: rgba(68, 152, 224, 1);
        border-color: rgba(68, 152, 224, 1);
    }

    .green-bg {
        background-color: rgba(35, 159, 40, 0.1);
        color: rgba(35, 159, 40, 1);
        border-color: rgba(35, 159, 40, 1);
    }

    .pink-bg {
        background-color: rgba(242, 155, 192, 0.1);
        color: rgba(242, 155, 192, 1);
        border-color: rgba(242, 155, 192, 1);
    }

    .red-bg {
        background-color: rgba(194, 63, 56, 0.1);
        color: rgba(194, 63, 56, 1);
        border-color: rgba(194, 63, 56, 1);
    }

    table {
        width: -webkit-fill-available;
        font-size: 13px;
    }

    @media (max-width: 900px) {
        table {
            display: inline-block;
            overflow-x: auto;
            font-size: 13px;
        }
    }

    th,
    td {
        padding: 15px;
        text-align: left;
    }

    tr {
        border-bottom: 1px solid lightgray;
    }

    thead {
        border-bottom: 2px solid #4498e0;
    }

    .icons-color i {
        color: #4498e0;
    }

    .card-view-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1rem;
    }

    .text-gray {
        color: gray !important;
    }

    .text-black {
        color: black !important;
    }

    .text-sm {
        font-size: 12px;
    }

    ul {
        padding-left: 1rem !important;
    }

    .p-2 {
        padding: 0.8rem;
    }
`;

const PermissionsPopover = ({ currentRole }) => {
    return (
        <Widget
            src="nearui.near/widget/Layout.Popover"
            props={{
                triggerComponent: <i class="bi bi-info-circle"></i>,
                content: (
                    <div className="p-2">
                        <h5 className="text-gray">
                            Admins have permissions to:
                        </h5>
                        <ul className="text-black text-sm">
                            {policy?.roles?.[currentRole]?.permissions?.map(
                                (i) => (
                                    <li>{i}</li>
                                )
                            )}
                        </ul>
                    </div>
                )
            }}
        />
    );
};

const RoleTag = ({ roles, showIcon }) => {
    const tags = [];
    roles.map((item) => {
        tags.push(
            <div
                className={`custom-tag ${
                    RolesColor.find((i) => i.role === item)?.color
                }-bg`}
            >
                {item}
                {showIcon && <PermissionsPopover currentRole={item} />}
            </div>
        );
    });
    return <div className="d-flex gap-2">{tags.map((i) => i)}</div>;
};

const Table = ({ title, tableData, showExpand }) => {
    if (!tableData?.length > 0) {
        return;
    }

    return (
        <div className="ndc-card icons-color my-4 p-4">
            {title && (
                <div className="d-flex justify-content-between">
                    <h4 className="d-flex gap-2">
                        {title} <PermissionsPopover currentRole={title} />
                    </h4>
                    {showExpand && (
                        <div
                            onClick={() => {
                                const data = { ...state.expandedTables };
                                data[title] =
                                    typeof data[title] === "boolean"
                                        ? !data[title]
                                        : false;

                                State.update({ expandedTables: data });
                            }}
                        >
                            {state.expandedTables[title] !== false ? (
                                <i class="bi bi-caret-up"></i>
                            ) : (
                                <i class="bi bi-caret-down"></i>
                            )}
                        </div>
                    )}
                </div>
            )}
            {state.expandedTables[title] !== false && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            {state.selectedView === viewTypes.LIST && (
                                <th>Role</th>
                            )}
                            <th>
                                Casted Votes
                                <i class="bi bi-arrow-down"></i>
                            </th>

                            <th>
                                Yes Votes
                                <i class="bi bi-arrow-down"></i>
                            </th>
                            <th>
                                No Votes
                                <i class="bi bi-arrow-down"></i>
                            </th>
                            <th>
                                Spam Votes
                                <i class="bi bi-arrow-down"></i>
                            </th>
                            <th>
                                Proposals <br />
                                Accepted/ Created
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData?.map((item) => {
                            return (
                                <tr>
                                    <td>
                                        <Widget
                                            src="nearui.near/widget/Element.User"
                                            props={{
                                                accountId: item.account,
                                                options: {
                                                    showHumanBadge: true,
                                                    showImage: true,
                                                    showSocialName: true
                                                }
                                            }}
                                        />
                                    </td>
                                    {state.selectedView === viewTypes.LIST && (
                                        <td>
                                            <RoleTag
                                                showIcon={false}
                                                roles={item?.groups}
                                            />
                                        </td>
                                    )}
                                    <td> {item.approve + item.rejected}</td>
                                    <td> {item.approve}</td>
                                    <td> {item.rejected}</td>
                                    <td>{item.spamVotes ?? 0}</td>
                                    <td>
                                        {item.acceptedProposals} /{" "}
                                        {item.totalProposals}
                                    </td>
                                    <td className="d-flex gap-2 align-items-center">
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: (
                                                    <i class="bi bi-person-plus"></i>
                                                ),
                                                variant: "icon info outline",
                                                size: "sm",
                                                onClick: () => {}
                                            }}
                                        />
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: (
                                                    <i class="bi bi-arrow-counterclockwise"></i>
                                                ),
                                                size: "sm",
                                                variant: "icon info outline",
                                                onClick: () => {}
                                            }}
                                        />
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: "Propose to Mint",
                                                size: "sm",
                                                variant: "info outline",
                                                disabled: item.isHuman,
                                                onClick: () => {}
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const actions = {
    AddProposal: "create proposal",
    VoteApprove: "vote approve",
    VoteReject: "vote reject",
    VoteRemove: "vote remove"
};

const kinds = {
    config: "Change config",
    policy: "Change policy",
    add_member_to_role: "Add member to role",
    remove_member_from_role: "Remove member from role",
    call: "Call",
    upgrade_self: "Upgrade self",
    upgrade_remote: "Upgrade remote",
    transfer: "Transfer",
    set_vote_token: "Set staking contract",
    add_bounty: "Add bounty",
    bounty_done: "Bounty done",
    vote: "Vote",
    factory_info_update: "Factory info update",
    policy_add_or_update_role: "Change policy add or update role",
    policy_remove_role: "Change policy remove role",
    policy_update_default_vote_policy:
        "Change policy update default vote policy",
    policy_update_parameters: "Change policy update parameters",
    "*": "All types"
};

const renderPermissions = (role) => {
    const permissions = new Map();
    const rolePermissions =
        role === "all"
            ? policy.everyone?.permissions
            : policy.roles[role].permissions;
    rolePermissions?.forEach((p) => {
        const [kindKey, actionKey] = p.split(":");
        const kind = kinds[kindKey] || kindKey;
        const action = actions[actionKey] || actionKey;
        if (!permissions.has(action)) {
            permissions.set(action, new Set());
        }
        permissions.get(action).add(kind);
    });

    const filteredPermissions = new Map(
        [...permissions].filter(([action, kindsSet]) => kindsSet.size > 0),
        [...permissions].filter(([action, kindsSet]) => kindsSet.size > 0)
    );
    const sortedPermissions = Array.from(filteredPermissions.entries()).sort(
        (a, b) => {
            if (a[0] === actions.AddProposal) {
                return -1;
            }
            if (b[0] === actions.AddProposal) {
                return 1;
            }
            return 0;
        }
    );
    return sortedPermissions.map(([action, kindsSet], i) => (
        <li key={i}>
            <span className="text-capitalize">{action}</span>{" "}
            {action === actions.AddProposal
                ? "of the following types:"
                : "on proposals of the following types:"}
            <ul>
                {Array.from(kindsSet).map((kind, j) => (
                    <li key={j}>{kind}</li>
                ))}
            </ul>
        </li>
    ));
};

const isUserAllowedTo = (user, kind, action) => {
    const userRoles = policy?.users?.[user] || ["Everyone"];
    let allowed = false;

    userRoles.forEach((role) => {
        let permissions = policy?.roles?.[role]?.permissions;
        if (role === "Everyone") {
            permissions = policy.everyone.permissions;
        }

        const allowedRole =
            permissions?.includes(`${kind.toString()}:${action.toString()}`) ||
            permissions?.includes(`${kind.toString()}:*`) ||
            permissions?.includes(`*:${action.toString()}`) ||
            permissions?.includes("*:*");

        allowed = allowed || allowedRole;
        return allowedRole;
    });
    return allowed;
};

const ProposeToRemove = ({ user }) => {
    if (
        isUserAllowedTo(
            context.accountId,
            "remove_member_from_role",
            "AddProposal"
        )
    )
        return (
            <Widget
                src="nearui.near/widget/Layout.Modal"
                props={{
                    toggle: (
                        <Widget
                            src="nearui.near/widget/Input.Button"
                            props={{
                                children: "Propose to Remove",
                                size: "sm",
                                variant: ["danger", "outline"],
                                className: "w-100"
                            }}
                        />
                    ),
                    content: (
                        <div className="ndc-card p-4">
                            <Widget
                                src="nearui.near/widget/Input.Select"
                                props={{
                                    label: "Propose to remove from role:",
                                    options: rolesArray.map((r) => {
                                        return {
                                            title: r,
                                            value: r
                                        };
                                    }),
                                    onChange: (v) =>
                                        State.update({
                                            removeFromRole: v
                                        }),
                                    value: state.removeFromRole
                                }}
                            />
                            <Widget
                                src="nearui.near/widget/Input.Button"
                                props={{
                                    children: "Propose to Remove",
                                    size: "sm",
                                    variant: ["danger"],
                                    className: "w-100",
                                    onClick: () =>
                                        onRemoveUserProposal(
                                            user,
                                            state.removeFromRole
                                        )
                                }}
                            />
                        </div>
                    )
                }}
            />
        );

    return null;
};

const UIData =
    state.filters?.length > 0 || state.search ? state.filteredData : data;

const GroupView = () => {
    const view = rolesArray?.map((role) => {
        return (
            <Table
                title={role}
                tableData={UIData?.filter((item) => item.groups.includes(role))}
                showExpand={true}
            />
        );
    });
    return <div>{view?.map((item) => item)}</div>;
};

return (
    <Wrapper className="d-flex flex-column gap-4">
        <h2>Members</h2>
        <div className="ndc-card p-4">
            <h4 className="mb-4">Groups</h4>
            <div className="d-flex gap-4 flex-wrap">
                <RoleTag roles={rolesArray} showIcon={true} />
            </div>
        </div>
        <div
            className={`${
                state.selectedView !== viewTypes.LIST ? "ndc-card p-4" : ""
            } d-flex gap-2 flex-wrap`}
        >
            <Widget
                src="nearui.near/widget/Input.Text"
                props={{
                    value: state.search,
                    placeholder:
                        state.selectedView === viewTypes.GROUP
                            ? "Search by name"
                            : "Search by name or groups",
                    onChange: (value) => {
                        const filteredData = [...data];
                        if (value) {
                            filteredData = filteredData?.filter((item) => {
                                const searchTerm = value.toLowerCase();
                                return item.account.includes(searchTerm);
                            });
                        }
                        State.update({
                            ...state,
                            filteredData: filteredData,
                            search: value
                        });
                    },
                    icon: (
                        <i
                            className="bi bi-search"
                            style={{
                                color: "#4498e0 !important"
                            }}
                        />
                    ),
                    inputProps: {
                        title: "Disabled because no API for searching yet"
                    }
                }}
            />
            <Widget
                src="nearui.near/widget/Layout.Popover"
                props={{
                    triggerComponent: (
                        <Widget
                            src="nearui.near/widget/Input.Button"
                            props={{
                                style: {
                                    color: "#4498e0"
                                },
                                children: (
                                    <>
                                        {state.selectedView} View
                                        <i class="bi bi-caret-down"></i>
                                    </>
                                ),
                                variant: "info outline ",
                                size: "md",
                                className: ""
                            }}
                        />
                    ),
                    content: (
                        <Widget
                            src="/*__@appAccount__*//widget/DAO.Members.GroupModal"
                            props={{
                                viewList: viewList,
                                cancel: () => {
                                    State.update({
                                        ...state,
                                        selectedView: ""
                                    });
                                },
                                applyView: (selectedView) => {
                                    State.update({
                                        ...state,
                                        selectedView
                                    });
                                },
                                selectedView: state.selectedView
                            }}
                        />
                    )
                }}
            />

            <Widget
                src="nearui.near/widget/Layout.Modal"
                props={{
                    open: state.filtersOpen,
                    onOpenChange: (open) => {
                        State.update({
                            ...state,
                            filtersOpen: open
                        });
                    },
                    toggle: (
                        <Widget
                            src="nearui.near/widget/Input.Button"
                            props={{
                                children: (
                                    <>
                                        Filter
                                        <i className="bi bi-funnel"></i>
                                    </>
                                ),
                                variant: "info",
                                size: "md"
                            }}
                        />
                    ),
                    content: (
                        <Widget
                            src="/*__@appAccount__*//widget/DAO.Members.FilterModal"
                            props={{
                                selectedFilters: state.filters,
                                groupTypes: groupTypes,
                                cancel: () => {
                                    State.update({
                                        ...state,
                                        filters: []
                                    });
                                },
                                applyFilters: (filters) => {
                                    const filteredData = [...data];

                                    const rolesFilter = filters?.filter(
                                        (i) =>
                                            i !== groupTypes.ASCENDING &&
                                            i !== groupTypes.DESCENDING
                                    );
                                    if (rolesFilter?.length > 0) {
                                        filteredData = filteredData.filter(
                                            (item) =>
                                                item.groups.some((i) =>
                                                    filters?.includes(i)
                                                )
                                        );
                                    }

                                    if (
                                        filters.includes(groupTypes.ASCENDING)
                                    ) {
                                        filteredData = filteredData
                                            .slice()
                                            .sort((a, b) =>
                                                a.account.localeCompare(
                                                    b.account
                                                )
                                            );
                                    }
                                    if (
                                        filters.includes(groupTypes.DESCENDING)
                                    ) {
                                        filteredData = filteredData
                                            .slice()
                                            .sort((a, b) =>
                                                b.account.localeCompare(
                                                    a.account
                                                )
                                            );
                                    }

                                    State.update({
                                        ...state,
                                        filters: filters,
                                        filteredData: filteredData
                                    });
                                },
                                filterlist: filterlist
                            }}
                        />
                    )
                }}
            />
        </div>
        {state.isLoading ? (
            <div>
                <Widget src="nearui.near/widget/Feedback.Spinner" />
            </div>
        ) : (
            <div>
                {state.selectedView === viewTypes.GROUP && <GroupView />}
                {state.selectedView === viewTypes.LIST && (
                    <Table tableData={UIData} />
                )}
                {state.selectedView === viewTypes.CARD && (
                    <div className="card-view-grid">
                        {UIData?.map((item) => {
                            return (
                                <div className="ndc-card p-4 d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Widget
                                            src="nearui.near/widget/Element.User"
                                            props={{
                                                accountId: item.account,
                                                options: {
                                                    showHumanBadge: true,
                                                    showImage: true,
                                                    showSocialName: true
                                                }
                                            }}
                                        />
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: (
                                                    <i class="bi bi-person-plus"></i>
                                                ),
                                                variant: "icon info outline",
                                                onClick: () => {}
                                            }}
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <RoleTag
                                            showIcon={true}
                                            roles={item?.groups}
                                        />
                                    </div>
                                    <div style={{ height: "4rem" }}></div>
                                    <div className="d-flex justify-content-between">
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: "Propose to Mint SBT",
                                                variant: "info",
                                                disabled: item.isHuman,
                                                size: "sm",
                                                onClick: () => {}
                                            }}
                                        />
                                        {/* <ProposeToRemove user={item.account} /> */}
                                    </div>
                                    <Widget
                                        src="nearui.near/widget/Input.Button"
                                        props={{
                                            buttonProps: {
                                                style: { width: "inherit" }
                                            },
                                            children: "View Voting History",
                                            variant: "info outline",
                                            size: "sm",
                                            onClick: () => {}
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}
    </Wrapper>
);
