const { proposals, resPerPage, state, update, isCongressDaoID, daoConfig } =
    props;
const { daoId, multiSelectMode } = state;
const accountId = props.accountId ?? context.accountId ?? "";

const Table = styled.div`
    font-size: 13px;
    font-weight: 600;
    max-width: 100%;
    overflow-x: auto;
    height: 100%;
    min-height: 100%;

    td,
    th {
        vertical-align: middle;
    }

    tr {
        height: 58px;
    }

    .id-value {
        border: 1px solid #4498e0;
        color: #4498e0;
        padding: 4px 8px;
        background: rgba(68, 152, 224, 0.1);
        border-radius: 100px;
        font-size: 12px;
        font-weight: 500;
    }
`;

const roles = isCongressDaoID
    ? Near.view(daoId, "get_members")
    : Near.view(daoId, "get_policy");

roles = roles === null ? [] : roles?.roles ?? roles;

// -- Filter the user roles
const userRoles = [];
if (Array.isArray(roles)) {
    for (const role of roles) {
        if (role.kind === "Everyone") {
            userRoles.push(role);
            continue;
        }
        if (!role.kind.Group) continue;
        if (
            accountId &&
            role.kind.Group &&
            role.kind.Group.includes(accountId)
        ) {
            userRoles.push(role);
        }
    }
}

if (isCongressDaoID) {
    userRoles = [
        {
            name: "all",
            kind: "Everyone",
            permissions: roles?.permissions,
            vote_policy: {}
        }
    ];
}
const isAllowedTo = (kind, action) => {
    // -- Check if the user is allowed to perform the action
    let allowed = false;
    userRoles
        .filter(({ permissions }) => {
            if (isCongressDaoID) {
                const allowedRole =
                    permissions.includes(`${kind.toString()}`) &&
                    roles?.members?.includes(accountId);
                allowed = allowed || allowedRole;
                return allowedRole;
            } else {
                const allowedRole =
                    permissions.includes(
                        `${kind.toString()}:${action.toString()}`
                    ) ||
                    permissions.includes(`${kind.toString()}:*`) ||
                    permissions.includes(`*:${action.toString()}`) ||
                    permissions.includes("*:*");
                allowed = allowed || allowedRole;
                return allowedRole;
            }
        })
        .map((role) => role.name);
    return allowed;
};

return (
    <Table
        class="table-responsive my-3"
        style={{
            minHeight: 65 * (proposals?.length ?? resPerPage)
        }}
    >
        {proposals === null ? (
            <>
                <Widget src="nearui.near/widget/Feedback.Spinner" />
            </>
        ) : (
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Proposer</th>
                        <th scope="col" className="text-center">
                            Type
                        </th>
                        <th scope="col" className="text-center">
                            Status
                        </th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {proposals !== null &&
                        proposals.map(
                            ({ proposal, proposal_type, proposal_id }, i) => {
                                if (!isCongressDaoID) {
                                    proposal.kind = {
                                        [proposal_type]: {
                                            ...proposal.kind
                                        }
                                    };
                                }
                                proposal.id = proposal_id;
                                if (proposal.status === "Removed") return <></>;
                                Object.keys(proposal.vote_counts).forEach(
                                    (k) => {
                                        if (
                                            typeof proposal.vote_counts[k] ==
                                            "string"
                                        ) {
                                            proposal.vote_counts[k] =
                                                proposal.vote_counts[k]
                                                    .match(/.{1,2}/g)
                                                    .map((x) => parseInt(x));
                                        }
                                    }
                                );
                                return (
                                    <Widget
                                        src="/*__@appAccount__*//widget/DAO.Proposals.Table.Row"
                                        props={{
                                            proposal,
                                            proposal_type,
                                            proposal_id,
                                            i,
                                            daoId,
                                            multiSelectMode,
                                            isAllowedTo,
                                            isCongressDaoID,
                                            daoConfig
                                        }}
                                    />
                                );
                            }
                        )}
                </tbody>
            </table>
        )}
    </Table>
);
