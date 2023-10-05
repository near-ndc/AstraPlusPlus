const CoADaoId = "/*__@replace:CoADaoId__*/";
const VotingBodyDaoId = "/*__@replace:VotingBodyDaoId__*/";
const TCDaoId = "/*__@replace:TCDaoId__*/";
const HoMDaoId = "/*__@replace:HoMDaoId__*/";

let { page, tab, daoId } = props;
if (!page) {
    page = "home";
}
const currentLink = "#//*__@appAccount__*//widget/home";

State.init({
    activePage: page,
    activeTab: tab,
    activeDaoId: daoId
});

if (
    page !== state.activePage ||
    tab !== state.activeTab ||
    daoId !== state.activeDaoId
) {
    State.update({
        activePage: page,
        activeTab: tab,
        activeDaoId: daoId
    });
}

page = state.activePage;

const router = {
    params: {
        page: page,
        tab: tab,
        daoId: daoId
    },
    navigate: (newParams) => {
        router.params = {
            ...newParams
        };
        State.update({
            activePage: router.params.page,
            activeTab: router.params.tab,
            activeDaoId: router.params.daoId
        });
    }
};

const pages = [
    [
        {
            title: "Home",
            icon: <i className="bi bi-house-door"></i>,
            active: page.split("-")[0] === "home",
            href: currentLink + "?page=home",
            onClick: () => router.navigate({ page: "home" }),
            widgetName: "Feed.index",
            defaultProps: {}
        },
        {
            title: "Social feed",
            active: page === "home",
            href: currentLink + "?page=home",
            onClick: () => router.navigate({ page: "home" }),
            widgetName: "Feed.index",
            defaultProps: {}
        },
        {
            title: "My proposals",
            active: page === "my-proposals",
            href: currentLink + "?page=my-proposals",
            onClick: () => router.navigate({ page: "my-proposals" }),
            widgetName: "MyProposals.index",
            defaultProps: {}
        }
    ],
    [
        {
            title: "Government",
            icon: <i className="bi bi-bank"></i>,
            active: page.split("-")[0] === "congress",
            href: currentLink + "?page=congress",
            onClick: () => router.navigate({ page: "congress" }),
            widgetName: "Congress.index",
            defaultProps: {}
        },
        {
            title: "HoM",
            active: page === "dao" && daoId === HoMDaoId,
            href: currentLink + `?page=dao&daoId=${HoMDaoId}`,
            onClick: () => router.navigate({ page: "dao" }),
            widgetName: "DAO.index",
            defaultProps: { daoId: HoMDaoId }
        },
        {
            title: "CoA",
            active: page === "dao" && daoId === CoADaoId,
            href: currentLink + `?page=dao&daoId=${CoADaoId}`,
            onClick: () => router.navigate({ page: "dao" }),
            widgetName: "DAO.index",
            defaultProps: { daoId: CoADaoId }
        },
        {
            title: "TC",
            active: page === "dao" && daoId === TCDaoId,
            href: currentLink + `?page=dao&daoId=${TCDaoId}`,
            onClick: () => router.navigate({ page: "dao" }),
            widgetName: "DAO.index",
            defaultProps: { daoId: TCDaoId }
        },
        {
            title: "Voting Body",
            active: page === "dao" && daoId === VotingBodyDaoId,
            href: currentLink + `?page=dao&daoId=${VotingBodyDaoId}`,
            onClick: () => router.navigate({ page: "dao" }),
            widgetName: "DAO.index",
            defaultProps: { daoId: VotingBodyDaoId }
        }
    ],
    [
        {
            title: "DAOs",
            icon: <i class="bi bi-grid"></i>,
            active: page === "daos",
            href: currentLink + "?page=daos",
            onClick: () => router.navigate({ page: "daos" }),
            widgetName: "DAOs.index",
            defaultProps: {}
        },
        {
            title: "My DAOs",
            active: page === "my-daos",
            href: currentLink + "?page=my-daos",
            widgetName: "DAOs.index",
            onClick: () => router.navigate({ page: "my-daos" }),
            defaultProps: {
                filter: "myDAOs"
            }
        },
        {
            title: "Following",
            active: page === "daos-following",
            href: currentLink + "?page=daos-following",
            widgetName: "DAOs.index",
            onClick: () => router.navigate({ page: "daos-following" }),
            defaultProps: {
                filter: "followedDAOs"
            }
        },
        {
            title: "All",
            active: page === "daos",
            href: currentLink + "?page=daos",
            widgetName: "DAOs.index",
            onClick: () => router.navigate({ page: "daos" }),
            defaultProps: {}
        }
    ],
    {
        title: "Bounties area",
        icon: <i class="bi bi-briefcase"></i>,
        active: page === "bounties",
        href: currentLink + "?page=bounties",
        onClick: () => router.navigate({ page: "bounties" }),
        widgetName: "Bounties.index",
        defaultProps: {}
    },
    {
        title: "Actions library",
        icon: <i class="bi bi-code-slash"></i>,
        active: page === "actions",
        href: currentLink + "?page=actions",
        onClick: () => router.navigate({ page: "actions" }),
        widgetName: "actions"
    },
    {
        title: "Create DAO",
        active: page === "create-dao",
        href: currentLink + "?page=create-dao",
        onClick: () => router.navigate({ page: "create-dao" }),
        widgetName: "CreateDAO.index",
        hidden: true
    },
    {
        title: "DAO",
        active: page === "dao",
        href: currentLink + "?page=dao",
        onClick: (daoId, tab) => router.navigate({ page: "dao", daoId, tab }),
        widgetName: "DAO.index",
        hidden: true
    }
];

let activePage = null;
pages.find((page) => {
    if (Array.isArray(page)) {
        return page.find((subPage) => {
            if (subPage.active) {
                activePage = subPage;
                return true;
            }
            return false;
        });
    }
    if (page.active) {
        activePage = page;
        return true;
    }
    return false;
});

const pageContent = activePage ? (
    <Widget
        src={"/*__@appAccount__*//widget/" + activePage.widgetName}
        props={{
            router,
            ...activePage.defaultProps,
            ...props
        }}
    />
) : (
    "404"
);

const Root = styled.div`
    font-family:
        "Open Sans",
        "Manrope",
        system-ui,
        -apple-system,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        "Noto Sans",
        "Liberation Sans",
        Arial,
        sans-serif,
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji";
    font-size: 16px;
    line-height: 1.5;
    color: #000;

    a {
        color: #000;
        text-decoration: none;
    }

    a:hover {
        color: #4498e0;
    }

    .ndc-card {
        border-radius: 16px;
        box-shadow:
            rgba(0, 0, 0, 0.1) 0 1px 3px,
            rgba(0, 0, 0, 0.05) 0 1px 20px;
        background-color: #fff;
    }
`;
return (
    <Root className="row">
        <Widget src={`nearui.near/widget/Typography.OpenSansFont`} />

        <Widget
            src="/*__@appAccount__*//widget/Common.Layout.Header"
            props={{
                items: pages
            }}
        />
        {activePage.widgetName === "Congress.index" ? (
            <div className="col">{pageContent}</div>
        ) : (
            <div className="col ms-sm-4 ps-lg-5 py-3 py-md-5">
                {pageContent}
            </div>
        )}
    </Root>
);
