const data = props.data;
const daoId = props.daoId;
const currentUserClaim = props.currentUserClaim;
if (!data) {
  return;
}

const policy = Near.view(daoId, "get_policy");
const Container = styled.div`
  .green-btn {
  }
  .red-btn {
  }
`;

console.log(data, currentUserClaim);

const bountyClaims = Near.view(daoId, "get_bounty_number_of_claims", {
  id: data.id
});

function getBountyState() {}
function onClaimBounty() {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_claim",
      args: { id: data.id, deadline: data.max_deadline },
      deposit: policy?.bounty_bond ?? 100000000000000000000000,
      gas: 200000000000000
    }
  ]);
}

function onGiveUpBounty() {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_giveup",
      args: { id: data.id },
      deposit: 100000000000000000000000,
      gas: 200000000000000
    }
  ]);
}

function onCompleteBounty() {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_done",
      args: { id: data.id, deadline: data.max_deadline },
      deposit: policy?.bounty_bond ?? 100000000000000000000000,
      gas: 200000000000000
    }
  ]);
}

const isClaimed = bountyClaims === data.times || currentUserClaim;

return (
  <Container className="ndc-card w-100 h-100">
    <div className="d-flex flex-column gap-2 px-4 pt-3 pb-2">
      <h5>
        <a
          href={`#//*__@appAccount__*//widget/DAO.Bounties.BountyDetails?id=${data.id}&daoId=${daoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-color"
        >
          <div className="d-flex gap-2 align-items-center">
            <div>{data.id}</div>

            <div>
              <i class="bi bi-box-arrow-up-right"></i>
            </div>
          </div>
        </a>
      </h5>
      <p
        style={{ backgroundColor: "#F8F6F6", color: "#3F3F3F" }}
        className="rounded-2 p-3"
      >
        {data.description.substring(0, 250)}
        {data.description.length > 250 && "..."}
      </p>
      <div className="d-flex justify-content-between">
        <div className="text-muted text-sm">Amount</div>
        <Widget
          src="/*__@appAccount__*//widget/Common.Components.TokenAmount"
          props={{
            amountWithoutDecimals: data.amount,
            address: data.token
          }}
        />
      </div>
    </div>
    <hr />
    <div className="px-4 py-3 d-flex justify-content-between gap-2">
      <div>
        {isClaimed && !currentUserClaim && (
          <h6 className="text-muted mb-0">Unavailable</h6>
        )}

        {currentUserClaim && (
          <div className="d-flex gap-2 align-items-center">
            <Widget
              src="nearui.near/widget/Input.Button"
              props={{
                children: "Give Up",
                variant: "danger outline ",
                onClick: onGiveUpBounty
              }}
            />
            <Widget
              src="nearui.near/widget/Input.Button"
              props={{
                children: "Complete",
                variant: "success outline ",
                onClick: onCompleteBounty
              }}
            />
          </div>
        )}
      </div>
      <div className="d-flex gap-2 align-items-center">
        <Widget
          src="nearui.near/widget/Input.Button"
          props={{
            children: (
              <Widget src="/*__@appAccount__*//widget/DAO.Bounties.LinkBreakSvg" />
            ),
            variant: "icon info outline ",
            size: "sm",
            disabled: isClaimed,
            onClick: onClaimBounty
          }}
        />
        <div className="vertical-line"></div>
        <div className="d-flex">
          <div className="primary-color">{bountyClaims}</div>
          <div className="secondary-color">/{data.times}</div>
        </div>
      </div>
    </div>
  </Container>
);
