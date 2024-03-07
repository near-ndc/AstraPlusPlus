const {
  formState,
  errors,
  renderFooter,
  showSteps,
  updateParentState,
  isConfigScreen
} = props;
const { accountId } = context;

updateParentState || (updateParentState = () => {});

const initialAnswers = {
  policy: formState.policy
};
const groups = [...initialAnswers.policy.roles.map((role) => role.name)];

State.init({
  answers: initialAnswers,
  selectedGroup: null,
  voteWeight: 50,
  members: []
});

function onGroupChange(name) {
  const item = initialAnswers.policy.roles.find((i) => i.name === name);
  const voteWeight = item?.vote_policy.threshold ?? [1, 2];
  State.update({
    selectedGroup: name,
    voteWeight: parseInt((voteWeight?.[0] / voteWeight?.[1]) * 100),
    members: item.kind
  });
}

if (!state.selectedGroup) {
  onGroupChange(groups[0]);
}

// quorum: "0";
// threshold: (2)[(1, 2)];
// weight_kind: "RoleWeight";

const Wrapper = styled.div`
  max-height: 70vh;
  overflow-y: scroll;
  .selected-group {
    background-color: #eaf3fb;
    border-left: 3px solid #4498e0;
  }

  .pointer {
    cursor: pointer;
  }

  .text-md {
    font-size: 20px;
  }

  .border-right {
    border-right: 1px solid #f0efe7;
    overflow: auto;
  }

  .right-shadow {
    box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.1);
  }

  .text-sm {
    font-size: 13px;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-2 {
    flex: 1.5;
  }
`;

return (
  <Wrapper className={"mt-4 ndc-card" + (isConfigScreen ? " " : " p-4")}>
    {showSteps && (
      <h2 className="h5 fw-bold">
        <span
          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2"
          style={{
            width: "48px",
            height: "48px",
            border: "1px solid #82E299"
          }}
        >
          6
        </span>
        Quorum
      </h2>
    )}
    <div className="d-flex">
      <div className="p-4 right-shadow border-right flex-1">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex gap-3 align-items-center">
            <i class="bi bi-people-fill"></i>
            <div className="text-md">Groups</div>
            <Widget
              src="/*__@replace:nui__*//widget/Element.Badge"
              props={{
                children: initialAnswers?.policy?.roles?.length ?? 1,
                variant: `disabled round`,
                size: "md"
              }}
            />
          </div>
          <div className="d-flex flex-column gap-2">
            {groups.map((i) => (
              <div
                onClick={() => onGroupChange(i)}
                className={
                  "p-2 rounded-2 pointer " +
                  (state.selectedGroup === i ? "selected-group" : "")
                }
              >
                {i}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 p-4 border-right flex-2">
        <div className="d-flex gap-3 align-items-center">
          <i class="bi bi-people-fill"></i>
          <div className="text-md">Members</div>
          <Widget
            src="/*__@replace:nui__*//widget/Element.Badge"
            props={{
              children: state.members?.Group?.length ?? 1,
              variant: `disabled round`,
              size: "md"
            }}
          />
        </div>
        {state.members.Group && Array.isArray(state.members.Group)
          ? state.members.Group.map((i) => (
              <div className="border-bottom p-2">{i}</div>
            ))
          : state.members}
      </div>
      <div className="d-flex flex-column gap-2 p-4 flex-1">
        <div className="d-flex gap-3 align-items-center">
          <img
            src="https://ipfs.near.social/ipfs/bafkreid6uui42li7elyzxyogbm2lutj3arc3p6gmefc5qqsyerejjph4qa"
            height={20}
          />
          <div className="text-md">Voting Policy</div>
        </div>
        <div className="text-muted text-sm">
          What is the quorum required for the decision of this group
        </div>
        <div>
          <div className="d-flex justify-content-between">
            <label>Group quorum %</label>
            <Widget
              src="/*__@replace:nui__*//widget/Element.Badge"
              props={{
                children: state.voteWeight,
                variant: `info round`,
                size: "md"
              }}
            />
          </div>
          <div>
            <input
              type="range"
              min={0}
              max={100}
              value={state.voteWeight}
              onPointerUp={(e) => {
                State.update({
                  voteWeight: e.target.value
                });
              }}
              onChange={(e) => {
                State.update({
                  voteWeight: e.target.value
                });
              }}
              className="form-range"
            />
          </div>
        </div>
      </div>
    </div>
    {renderFooter(state.answers)}
  </Wrapper>
);
