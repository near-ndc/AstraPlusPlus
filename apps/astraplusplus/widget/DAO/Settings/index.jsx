const widgetOwner = props.widgetOwner ?? "/*__@appAccount__*/";
const daoId = props.daoId;
const Wrapper = styled.div`
  p {
    font-size: 13px;
  }
  .text-subdued {
    color: rgba(130, 134, 136, 1);
  }
`;

State.init({
  tab: "Links and Socials",
  answers: initialAnswers
});

const policy = Near.view(daoId, "get_config");
console.log(policy);
const constructURL = (paramObj, base) => {
  paramObj = { ...paramObj, page: "dao" };
  const baseURL = base ?? `#/${widgetOwner}/widget/home`;
  let params = "";
  for (const [key, value] of Object.entries(paramObj)) {
    if (key === "dev" && value === false) {
      continue;
    }
    params += `${key}=${value}&`;
  }
  params = params.slice(0, -1);
  return `${baseURL}?${params}`;
};

const hasPermission = (role, proposalKind, permissionType) => {
  const roleObj = state.answers.policy.roles.find((r) => r.name === role);

  if (roleObj) {
    const permission = `${proposalKind}:${permissionType}`;
    return roleObj.permissions.some(
      (p) =>
        p === permission ||
        p === "*:*" ||
        p === `${proposalKind}:*` ||
        p === `*:${permissionType}`
    );
  } else {
    return false;
  }
};

const Footer = () => {
  const isBtnDisabled = true;
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
          variant: "info " + (isBtnDisabled && "disabled"),
          size: "lg",
          onClick: () => {},
          buttonProps: {
            type: "submit"
          }
        }}
      />
    </div>
  );
};

const tabs = {
  "Links and Socials": {
    name: "Links and Socials",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step2`}
        props={{
          formState: state.form,
          onComplete: handleStepComplete,
          errors: state.errors,
          renderFooter: (stepState, otherProps) => <Footer />
        }}
      />
    )
  },
  "Cool Down Period": {
    name: "Cool Down Period",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step3`}
        props={{
          formState: state.form,
          onComplete: handleStepComplete,
          errors: state.errors,
          renderFooter: (stepState, otherProps) => <Footer />
        }}
      />
    )
  },
  "Proposal and Voting Permissions": {
    name: "Proposal and Voting Permissions",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step5`}
        props={{
          formState: state.form,
          onComplete: handleStepComplete,
          errors: state.errors,
          renderFooter: (stepState, otherProps) => <Footer />
        }}
      />
    )
  },
  "Bond & Deadlines": {
    name: "Bond & Deadlines",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step6`}
        props={{
          formState: state.form,
          onComplete: handleStepComplete,
          errors: state.errors,
          renderFooter: (stepState, otherProps) => <Footer />
        }}
      />
    )
  },
  Groups: {
    name: "Groups",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step4`}
        props={{
          formState: state.form,
          onComplete: handleStepComplete,
          errors: state.errors,
          renderFooter: (stepState, otherProps) => <Footer />
        }}
      />
    )
  },
  "Visual Changes": {
    name: "Visual Changes",
    component: (
      <Widget
        src={`/*__@appAccount__*//widget/CreateDAO.Step6`}
        props={{
          formState: state.form,
          onComplete: handleStepComplete,
          errors: state.errors,
          renderFooter: (stepState, otherProps) => <Footer />
        }}
      />
    )
  }
};

const update = (key, value) =>
  State.update({
    answers: {
      ...state.answers,
      [key]: value
    }
  });

const handleStepComplete = (value) => {
  const stepValid = true;
  Object.keys(value).forEach((key) => {
    const properties = types["/*__@appAccount__*//type/dao"].properties.find(
      (p) => p.name === key
    );
    const validation = validateType(properties.type, value[key], properties);
    if (validation) {
      State.update({
        errors: {
          ...state.errors,
          [key]: validation
        }
      });
      stepValid = false;
    } else {
      State.update({
        errors: {
          ...state.errors,
          [key]: null
        }
      });
    }
  });

  if (!stepValid) return;

  if (state.step === 5) {
    const finalAnswers = {
      ...state.form,
      ...value
    };

    State.update({
      step: state.step,
      form: finalAnswers
    });
    handleFormComplete(finalAnswers);
    return;
  }
  State.update({
    step: state.step + 1,
    form: {
      ...state.form,
      ...value
    }
  });
};

const tabContent = tabs[state.tab].component;

return (
  <Wrapper>
    <div className="d-flex gap-2 ">
      <div className="ndc-card d-flex flex-column gap-2 p-4">
        <h5>DAO Name and Purpose</h5>
        <h6 className="text-subdued">DAO Name</h6>
        <p>ksjdnf</p>
        <h6 className="text-subdued ">DAO Purpose</h6>
        <p>dkhbfdsj</p>
      </div>
      <div className="ndc-card d-flex flex-column gap-2 p-4">
        <h5>Legal Status and Doc</h5>
        <h6 className="text-subdued">Legal Status</h6>
        <p></p>
        <h6 className="text-subdued ">Documents</h6>
        <p></p>
      </div>
    </div>
    <div className="mt-4">
      <div className="ndc-card d-flex flex-column gap-2 p-4">
        <h5>More DAO settings</h5>
        <div className="w-100">
          <Widget
            src={`${widgetOwner}/widget/DAO.Layout.Tabs`}
            props={{
              tabs: tabs,
              tab: state.tab,
              update: (state) => State.update(state),
              allowHref: false
            }}
          />
          {tabContent}
        </div>
      </div>
    </div>
  </Wrapper>
);
