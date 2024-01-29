const { formState, daoId, hasPermission } = props;
const [configState, setConfigState] = useState({
  ...formState,
  coverImage: formState.flagCover ?? formState.coverImage,
  profileImage: formState.flagLogo ?? formState.profileImage,
  legalStatus: formState.legal.legalStatus,
  legalDocument: formState.legal.legalLink
});
const [selectedTab, setSelectedTab] = useState("Info");

const handleProposal = () => {
  const deposit = formState.policy.proposal_bond;
  const gas = 200000000000000;
  const metadata = {
    soulBoundTokenIssuer:
      typeof configState.soulBoundTokenIssuer === "string"
        ? configState.soulBoundTokenIssuer
        : undefined,
    links: Array.isArray(configState.links) ? configState.links : [],
    flagCover:
      configState.coverImage === "string" ? configState.coverImage : "",
    flagLogo:
      typeof configState.profileImage === "string"
        ? configState.profileImage
        : "",
    displayName: typeof configState.name === "string" ? configState.name : "",
    legal: {
      legalStatus:
        typeof configState.legalStatus === "string"
          ? configState.legalStatus
          : "",
      legalLink:
        typeof configState.legalDocument === "string"
          ? configState.legalDocument
          : ""
    }
  };
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "Update config",
          kind: {
            ChangeConfig: {
              config: {
                name: configState.name,
                purpose: configState.purpose,
                metadata: Buffer.from(JSON.stringify(metadata)).toString(
                  "base64"
                )
              }
            }
          }
        }
      },
      gas: gas,
      deposit: deposit
    }
  ]);
};

const Footer = () => {
  return (
    <div className="d-flex justify-content-end mt-4">
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: (
            <>
              <i class="bi bi-check-lg"></i> Propose changes
            </>
          ),
          variant: "info " + (!hasPermission && "disabled"),
          size: "lg",
          onClick: () => handleProposal(),
          buttonProps: {
            type: "submit"
          }
        }}
      />
    </div>
  );
};

const tabs = {
  Info: {
    name: "Info and KYC",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step1`}
        props={{
          formState: configState,
          isConfigScreen: true,
          updateParentState: (data) => setConfigState(data),
          renderFooter: () => <></>
        }}
      />
    )
  },
  Legal: {
    name: "Legal Links",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step2`}
        props={{
          formState: configState,
          isConfigScreen: true,
          updateParentState: (data) => setConfigState(data),
          renderFooter: () => <></>
        }}
      />
    )
  },
  Visual: {
    name: "Visual Changes",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step6`}
        props={{
          formState: configState,
          isConfigScreen: true,
          updateParentState: (data) => setConfigState(data),
          renderFooter: () => <></>
        }}
      />
    )
  }
};

const tabContent = tabs[selectedTab].component;
return (
  <div style={{ marginTop: 30 }}>
    <Widget
      src={`/*__@appAccount__*//widget/DAO.Layout.Tabs`}
      props={{
        tabs: tabs,
        tab: selectedTab,
        update: (state) => setSelectedTab(state.tab),
        allowHref: false
      }}
    />
    <div style={{ marginTop: "-25px" }}>{tabContent}</div>
    <Footer />
  </div>
);
