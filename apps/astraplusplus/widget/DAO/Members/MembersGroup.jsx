const data = props.data;
// const data = [
//     {
//         name: "megha19.near",
//         role: "admin",
//         castedVoted: "2",
//         yesVotes: "3",
//         noVotes: "2",
//         spamVotes: "2",
//         acceptedProposals: "3",
//         totalProposals: "3"
//     },
//     {
//         name: "govbot.ndctools.near",
//         role: "council admin",
//         castedVoted: "2",
//         yesVotes: "3",
//         noVotes: "2",
//         spamVotes: "2",
//         acceptedProposals: "3",
//         totalProposals: "3"
//     },
//     {
//         name: "govbot.ndctools.near",
//         role: "council admin",
//         castedVoted: "2",
//         yesVotes: "3",
//         noVotes: "2",
//         spamVotes: "2",
//         acceptedProposals: "3",
//         totalProposals: "3"
//     }
// ];

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
    ADMIN: "admin",
    COUNCIL: "council",
    REGULAR_MEMBERS: "regular",
    REMOVED_MEMBERS: "removed",
    ASCENDING: "ascending",
    DESCENDING: "descending"
};

const filterlist = [
    {
        label: "Admin",
        value: groupTypes.ADMIN
    },
    {
        label: "Council",
        value: groupTypes.COUNCIL
    },
    {
        label: "Regular Members",
        value: groupTypes.REGULAR_MEMBERS
    },
    {
        label: "Removed Members",
        value: groupTypes.REMOVED_MEMBERS
    },
    {
        label: "Alphabetical (A-Z)",
        value: groupTypes.ASCENDING
    },
    {
        label: "Alphabetical (Z-A)",
        value: groupTypes.DESCENDING
    }
];

State.init({
    filtersOpen: false,
    selectedView: viewTypes.GROUP,
    viewModalOpen: false,
    filters: [],
    expandedTables: {},
    isLoading: false,
    search: "",
    data: data
});

const Wrapper = styled.div`
    border: 1px solid transparent;

    &:hover {
        border: 1px solid #4498e0;
    }

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
        padding-inline: 1.3rem;
        padding-block: 0.5rem;
        display: flex;
        gap: 0.5rem;
        border-width: 1px;
        border-style: solid;
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
`;

const RoleTag = ({ role, showIcon }) => {
    const tags = [];

    if (role.includes(groupTypes.ADMIN)) {
        tags.push(
            <div className="custom-tag blue-bg">
                Admin
                {showIcon && <i class="bi bi-info-circle"></i>}
            </div>
        );
    }

    if (role?.includes(groupTypes.COUNCIL)) {
        tags.push(
            <div className="custom-tag green-bg">
                Council
                {showIcon && <i class="bi bi-info-circle"></i>}
            </div>
        );
    }
    if (role?.includes(groupTypes.REGULAR_MEMBERS)) {
        tags.push(
            <div className="custom-tag pink-bg">
                Regular Members
                {showIcon && <i class="bi bi-info-circle"></i>}
            </div>
        );
    }

    if (role?.includes(groupTypes.REMOVED_MEMBERS)) {
        tags.push(
            <div className="custom-tag red-bg">
                Removed Members
                {showIcon && <i class="bi bi-info-circle"></i>}
            </div>
        );
    }
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
                        {title} <i class="bi bi-info-circle"></i>
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
                                                role={item?.groups}
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
                                                disabled: !item.isHuman,
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

return (
    <Wrapper className="d-flex flex-column gap-4">
        <h2>Members</h2>
        <div className="ndc-card p-4">
            <h4 className="mb-4">Groups</h4>
            <div className="d-flex gap-4 flex-wrap">
                <div className="custom-tag blue-bg">
                    Admin
                    <i class="bi bi-info-circle"></i>
                </div>
                <div className="custom-tag green-bg">
                    Council
                    <i class="bi bi-info-circle"></i>
                </div>
                <div className="custom-tag pink-bg">
                    Regular Members
                    <i class="bi bi-info-circle"></i>
                </div>
                <div className="custom-tag red-bg">
                    Removed Members
                    <i class="bi bi-info-circle"></i>
                </div>
            </div>
        </div>
        <div
            className={`${
                state.selectedView !== viewTypes.LIST ? "ndc-card" : ""
            } p-4 d-flex gap-2 flex-wrap`}
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
                        const filteredData = data;
                        if (value) {
                            filteredData = state.data?.filter((item) => {
                                const searchTerm = value.toLowerCase();
                                if (item.account.includes(searchTerm)) {
                                    return item;
                                }
                            });
                        }
                        // State.update({
                        //     ...state,
                        //     data: filteredData,
                        //     search: value
                        // });
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
                src="nearui.near/widget/Layout.Modal"
                props={{
                    open: state.viewModalOpen,
                    onOpenChange: (open) => {
                        State.update({
                            ...state,
                            viewModalOpen: open
                        });
                    },

                    toggle: (
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
                                cancel: () => {
                                    State.update({
                                        ...state,
                                        filters: [],
                                        data: data
                                    });
                                },
                                applyFilters: (filters) => {
                                    // TODO: Update filters after getting API
                                    const filteredData = [...state.data];
                                    if (
                                        filters.includes(groupTypes.ASCENDING)
                                    ) {
                                        filteredData
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
                                        filteredData
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
                                        data: filteredData
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
                {state.selectedView === viewTypes.GROUP && (
                    <div>
                        <Table
                            title="Admin"
                            tableData={data?.filter((item) =>
                                item.groups.includes(groupTypes.ADMIN)
                            )}
                            showExpand={true}
                        />
                        <Table
                            title="Council"
                            tableData={data?.filter((item) =>
                                item.groups.includes(groupTypes.COUNCIL)
                            )}
                            showExpand={true}
                        />
                        <Table
                            title="Regular Members"
                            tableData={data?.filter((item) =>
                                item.groups.includes(groupTypes.REGULAR_MEMBERS)
                            )}
                            showExpand={true}
                        />
                        <Table
                            title="Removed Members"
                            tableData={data?.filter((item) =>
                                item.groups.includes(groupTypes.REMOVED_MEMBERS)
                            )}
                            showExpand={true}
                        />
                    </div>
                )}
                {state.selectedView === viewTypes.LIST && (
                    <Table tableData={data} />
                )}
                {state.selectedView === viewTypes.CARD && (
                    <div className="card-view-grid">
                        {data?.map((item) => {
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
                                            role={item?.groups}
                                        />
                                    </div>
                                    <div style={{ height: "4rem" }}></div>
                                    <div className="d-flex justify-content-between">
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: "Propose to Mint SBT",
                                                variant: "info",
                                                disabled: !item.isHuman,
                                                size: "sm",
                                                onClick: () => {}
                                            }}
                                        />
                                        <Widget
                                            src="nearui.near/widget/Input.Button"
                                            props={{
                                                children: "Propose to Remove",
                                                variant: "info outline",
                                                size: "sm",
                                                onClick: () => {}
                                            }}
                                        />
                                    </div>
                                    <Widget
                                        src="nearui.near/widget/Input.Button"
                                        props={{
                                            buttonProps: {
                                                style: { width: "inherit" }
                                            },
                                            children: "Voting History",
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
