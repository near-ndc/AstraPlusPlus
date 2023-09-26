const { router } = props;
const accountId = props.accountId ?? context.accountId ?? "";

const DEFAULT_IMG =
  "https://ipfs.near.social/ipfs/bafkreiazoiydksnt5bliswmbahayei4thjsh2xbucimzzgik56dxlwxzpa";
const HOM_IMG =
  "https://ipfs.near.social/ipfs/bafkreiazoiydksnt5bliswmbahayei4thjsh2xbucimzzgik56dxlwxzpa";
const COA_IMG =
  "https://ipfs.near.social/ipfs/bafkreic6hvutbozv6rmbyuspipmh3qkf55zd5zoye3sjz7wtgoc4w754lu";
const TC_IMG =
  "https://ipfs.near.social/ipfs/bafkreibiokdhinsxysyvddfoemsuedv7mkqyj7nbzy6z3zp44fpjnqzq6i";
const VB_IMG =
  "https://ipfs.near.social/ipfs/bafkreiazoiydksnt5bliswmbahayei4thjsh2xbucimzzgik56dxlwxzpa";

const Content = {
  hom: {
    title: "House of merit",
    description:
      "A group of experienced community members appointed by members of the ecosystem to represent them during votes and key decisions. The HoM is in charge of allocating the treasury and deploying capital for the growth of the ecosystem.",
    metadata: {
      funds: "10M",
      members: 15,
      proposals: { active: 1, total: 4 },
      powers: [
        {
          text: "HoM members can vote to approve budget proposals from CoA, provided that the CoA does not veto",
        },
        {
          text: "HoM members can vote to approve budget proposals from CoA, provided that the CoA does not veto",
        },
      ],
      checks: [
        { text: "CoA members can veto HoM budget approvals" },
        { text: "Voting body can dissolve HoM" },
        {
          text: "TC can investigate HoM members, remove members, or modify roles",
        },
      ],
    },
  },
  coa: {
    title: "Council of Advisor",
    description:
      "A group of experienced community members appointed by members of the ecosystem to represent them during votes and key decisions. The HoM is in charge of allocating the treasury and deploying capital for the growth of the ecosystem.",
    metadata: {
      funds: "5M",
      members: 7,
      proposals: { active: 1, total: 4 },
      powers: [{ text: "sdfsdf" }, { text: "dfgdfgdg dfg dfg d" }],
      checks: [{ text: "checksdfsf" }],
    },
  },
  tc: {
    title: "Transparency Commission",
    description:
      "A group of experienced community members appointed by members of the ecosystem to represent them during votes and key decisions. The HoM is in charge of allocating the treasury and deploying capital for the growth of the ecosystem.",
    metadata: {
      funds: "10M",
      members: 7,
      proposals: { active: 1, total: 4 },
      powers: [{ text: "sdfsdf" }, { text: "dfgdfgdg dfg dfg d" }],
      checks: [{ text: "checksdfsf" }],
    },
  },
  vb: {
    title: "Voting Body",
    description:
      "A group of experienced community members appointed by members of the ecosystem to represent them during votes and key decisions. The HoM is in charge of allocating the treasury and deploying capital for the growth of the ecosystem.",
    metadata: {
      funds: "10M",
      members: 7,
      proposals: { active: 1, total: 4 },
      powers: [{ text: "sdfsdf" }, { text: "dfgdfgdg dfg dfg d" }],
      checks: [{ text: "checksdfsf" }],
    },
  },
};

const Container = styled.div`
  background: rgba(217, 217, 217, 0.3);
  color: #464c50;

  #main {
    transition: margin-left 0.5s;

    h6 {
      font-weight: 700;
      margin: 0;
    }
  }
`;

const HousePanel = styled.div`
  width: 700px;
  background-color: #fff;
`;

const CircleLogo = styled.div`
  height: 65px;
  width: 65px;
  border-radius: 50%;
  border: 5px solid;
  background: black;
  color: white;
  text-transform: uppercase;
  border-color: ${(props) => props.color};
`;

const Tab = styled.div`
  padding: 2px 10px;
  border-radius: 20px;
  background: ${(props) => (props.selected ? "#ebebeb" : "transparent")};
  color: ${(props) => (props.selected ? "#000" : "inherit")};

  &:hover {
    cursor: pointer;
  }
`;

const Tabs = styled.div`
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 0.4);
  background: rgba(217, 217, 217, 0.1);
  display: flex;
  padding: 20px 14px;
  gap: 20px;
`;

const Img = styled.img`
  width: 90%;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  .dropdown-content {
    display: none;
    border-radius: 4px;
    position: absolute;
    right: -25px;
    top: 35px;
    background-color: #fff;
    min-width: 230px;
    z-index: 1;
    font-size: 14px;

    div,
    a {
      padding: 8px 12px;
      &:hover {
        background: #f8f9fa;
        cursor: pointer;
      }
    }
  }

  &:hover .dropdown-content {
    display: flex;
  }
`;

State.init({
  selectedHouse: props.house ?? "hom",
  selectedTab: "powers",
  copied: false,
});

const ColorMap = (house) =>
  house === "hom"
    ? "#5BC65F"
    : house === "coa"
    ? "#4498E0"
    : house === "tc"
    ? "#F19D38"
    : house === "vb"
    ? "#F29BC0"
    : "";

const ContentBlock = ({ title, abbr, address, description, metadata }) => (
  <div className="d-flex py-4 px-5 flex-column justify-content-between h-100">
    <div className="d-flex flex-column bg-white gap-4">
      <div className="d-flex justify-content-between">
        <CircleLogo
          className="d-flex justify-content-center align-items-center"
          color={ColorMap(abbr)}
        >
          <b>{abbr}</b>
        </CircleLogo>

        <Dropdown className="mt-1 px-2">
          <i class="bi bi-three-dots-vertical" />
          <div class="flex-column dropdown-content shadow">
            <a href="#//*__@appAccount__*//widget/home?page=proposals">
              Proposals
            </a>
            <a href="#//*__@appAccount__*//widget/home?page=members">Members</a>
          </div>
        </Dropdown>
      </div>
      <div>
        <div className="d-flex">
          <h4>
            <b>{title}</b>
          </h4>
          <Dropdown className="mt-1 px-2">
            <i className="bi bi-caret-down-fill" />
            <div class="flex-column dropdown-content shadow">
              <a
                onClick={() => State.update({ selectedHouse: "hom" })}
                href="#//*__@appAccount__*//widget/home?page=congress&house=hom"
              >
                {Content.hom.title}
              </a>
              <a
                onClick={() => State.update({ selectedHouse: "coa" })}
                href="#//*__@appAccount__*//widget/home?page=congress&house=coa"
              >
                {Content.coa.title}
              </a>
              <a
                onClick={() => State.update({ selectedHouse: "tc" })}
                href="#//*__@appAccount__*//widget/home?page=congress&house=tc"
              >
                {Content.tc.title}
              </a>
              <a
                onClick={() => State.update({ selectedHouse: "vb" })}
                href="#//*__@appAccount__*//widget/home?page=congress&house=vb"
              >
                {Content.vb.title}
              </a>
            </div>
          </Dropdown>
        </div>
        <small className="text-secondary">
          <b id="address">{address}</b>
        </small>
        <i
          className={state.copied ? "bi-check-lg" : "bi bi-clipboard"}
          role="button"
          onClick={() => {
            clipboard
              .writeText(address)
              .then(() => State.update({ copied: true }));
          }}
        />
      </div>
      <div>
        <small className="text-secondary mt-2 mb-3">{description}</small>
      </div>
      <div className="d-flex justify-content-between my-3">
        <div className="text-center">
          <h5 className="mb-0">
            <b>{metadata.funds} USD</b>
          </h5>
          <small className="text-secondary">
            <b>House Funds</b>
          </small>
        </div>
        <div className="text-center">
          <h5 className="mb-0">
            <b>
              {metadata.members}/{metadata.members}
            </b>
          </h5>
          <small className="text-secondary">
            <b>Members</b>
          </small>
        </div>
        <div className="text-center">
          <h5 className="mb-0">
            <b>
              {metadata.proposals.active}/{metadata.proposals.total}
            </b>
          </h5>
          <small className="text-secondary">
            <b>Active Proposals</b>
          </small>
        </div>
      </div>
      <Tabs className="flex-column mb-4">
        <div className="d-flex gap-2">
          <Tab
            onClick={() => State.update({ selectedTab: "powers" })}
            selected={state.selectedTab === "powers"}
          >
            <small>Powers {metadata.powers.length}</small>
          </Tab>
          <Tab
            onClick={() => State.update({ selectedTab: "checks" })}
            selected={state.selectedTab === "checks"}
          >
            <small>Check & Balances {metadata.checks.length}</small>
          </Tab>
        </div>
        <div>
          {state.selectedTab === "powers" &&
            metadata.powers.map((r) => (
              <div>
                <small>{r.text}</small>
              </div>
            ))}
          {state.selectedTab === "checks" &&
            metadata.checks.map((c) => (
              <div>
                <small>{c.text}</small>
              </div>
            ))}
        </div>
      </Tabs>
    </div>

    <div className="d-flex justify-content-end">
      <Widget
        src="nearui.near/widget/Layout.Modal"
        props={{
          toggle: (
            <Widget
              src="nearui.near/widget/Input.Button"
              props={{
                children: (
                  <>
                    Create Proposal
                    <i className="bi bi-16 bi-plus-lg"></i>
                  </>
                ),
                variant: "secondary",
              }}
            />
          ),
          content: (
            <div
              className="d-flex flex-column align-items-stretch"
              style={{
                width: "800px",
                maxWidth: "100vw",
              }}
            >
              <Widget
                src={"/*__@appAccount__*//widget/DAO.Proposal.Create"}
                props={{
                  daoId: daoId,
                }}
              />
            </div>
          ),
        }}
      />
    </div>
  </div>
);

return (
  <Container className="d-flex w-100">
    <div id="main" className="w-100">
      <div className="px-5 py-3 bg-dark">
        <h6>
          <span className="text-secondary">NDC Governance: </span>
          <span className="text-white">Interhouse relations</span>
        </h6>
      </div>
      <div className="w-100 d-flex justify-content-center align-items-center p-5">
        <Img
          src={
            state.selectedHouse === "hom"
              ? HOM_IMG
              : state.selectedHouse === "coa"
              ? COA_IMG
              : state.selectedHouse === "tc"
              ? TC_IMG
              : state.selectedHouse === "vb"
              ? VB_IMG
              : DEFAULT_IMG
          }
        />
      </div>
    </div>

    {state.selectedHouse && (
      <HousePanel className="shadow-sm">
        <ContentBlock
          title={Content[state.selectedHouse].title}
          description={Content[state.selectedHouse].description}
          abbr={state.selectedHouse}
          address={`${state.selectedHouse}@sputnik-dao.near`}
          metadata={Content[state.selectedHouse].metadata}
        />
      </HousePanel>
    )}
  </Container>
);
