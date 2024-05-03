const data = props.data;
const daoId = props.daoId;
if (!data) {
  return;
}

const Container = styled.div``;

function getBountyState() {}

const bountyClaims = 0;
const isClaimed = false;
return (
  <Container className="ndc-card w-100 h-100">
    <div className="container-fluid px-3 py-2">
      <div className="row">
        <div className="col-4">
          <h4>
            <a
              href={""}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-color"
            >
              <div className="d-flex gap-2 align-items-center">
                <div>{data.id}</div>

                <div>
                  <i className="bi bi-box-arrow-up-right"></i>
                </div>
              </div>
            </a>
          </h4>
        </div>
        <div
          style={{ backgroundColor: "#F8F6F6", color: "#3F3F3F" }}
          className="rounded-2 p-3 col"
        >
          {data.description}
        </div>
        <div className="row">
          <div className="text-muted text-sm col-4">Amount</div>
          <div className="col">
            <Widget
              src="/*__@appAccount__*//widget/Common.Components.TokenAmount"
              props={{
                amountWithoutDecimals: data.amount,
                address: data.token
              }}
            />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div className="container-fluid px-3 py-2">
      <div className="row gy-3">
        <div className="col-4"></div>
        <div className="col d-flex gap-2 align-items-center">
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: (
                <Widget src="/*__@appAccount__*//widget/DAO.Bounties.LinkBreakSvg" />
              ),
              variant: "icon info outline " + isClaimed ? "disabled" : "",
              size: "sm",
              onClick: () => {}
            }}
          />
          <div className="vertical-line"></div>
          <div className="d-flex">
            <div className="primary-color">{bountyClaims}</div>
            <div className="secondary-color">/{data.times}</div>
          </div>
        </div>
      </div>
    </div>
  </Container>
);
