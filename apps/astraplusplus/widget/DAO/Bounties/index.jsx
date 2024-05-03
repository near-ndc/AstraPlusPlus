const daoId = props.daoId;
const resPerPage = 20;

State.init({
  page: 0,
  view: "grid"
});

const userClaimedBounties = Near.view(daoId, "get_bounty_claims", {
  account_id: context.accountId
});

const bounties = Near.view(daoId, "get_bounties", {
  from_index: state.page * resPerPage,
  limit: resPerPage
});

const Container = styled.div`
  .vertical-line {
    width: 1px;
    height: 35px;
    background-color: #f0efe7;
  }

  .black-btn {
    background-color: black !important;
    color: white !important;
  }

  .white-btn {
    color: black !important;
    background-color: white !important;
    border-color: #f0efe7 !important;
  }

  .text-sm {
    font-size: 13px;
  }

  hr {
    color: #f0efe7 !important;
    opacity: 1 !important;
    margin: 0 !important;
  }

  .primary-color {
    color: #4498e0;
  }

  .secondary-color {
    color: #7e7d7e;
  }
`;

console.log(userClaimedBounties);
const Bounties = () => {
  if (bounties === null) {
    return <Widget src="nearui.near/widget/Feedback.Spinner" />;
  } else if (Array.isArray(bounties) && bounties.length > 0) {
    return state.view === "grid" ? (
      <div class="container-fluid">
        <div class="row gy-3">
          {bounties.map((item) => (
            <div class="col-sm-3 h-100 d-flex" style={{ width: "400px" }}>
              <Widget
                src="/*__@appAccount__*//widget/DAO.Bounties.GridCard"
                props={{
                  data: item,
                  daoId: daoId,
                  currentUserClaim:
                    (userClaimedBounties ?? []).find(
                      (i) => i.bounty_id === item.id
                    ) ?? null
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="d-flex flex-column gap-3">
        {bounties.map((item) => (
          <div>
            <Widget
              src="/*__@appAccount__*//widget/DAO.Bounties.ListCard"
              props={{ data: item, daoId: daoId }}
            />
          </div>
        ))}
      </div>
    );
  } else {
    return "No bounties exists.";
  }
};

return (
  <Container className="d-flex flex-column gap-4">
    <div className="d-flex justify-content-end gap-2 align-items-center">
      <Widget
        src="/*__@appAccount__*//widget/DAO.Bounties.ProposeBounty"
        props={{ daoId: daoId }}
      />
      <div className="vertical-line"></div>
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: <i class="bi bi-grid"></i>,
          variant: "icon",
          className: state.view === "grid" ? "black-btn" : "white-btn",
          onClick: () => State.update({ view: "grid" })
        }}
      />
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: <i class="bi bi-list-ul"></i>,
          variant: "icon",
          className: state.view === "grid" ? "white-btn" : "black-btn",
          onClick: () => State.update({ view: "list" })
        }}
      />
    </div>
    <Bounties />
  </Container>
);
