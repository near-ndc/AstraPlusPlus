const id = props.id;
const name = props.name;
const description = props.description;
const amount = props.amount;
const accountID = props.token;

if (!id) {
  return "Bounty ID not provided";
}

const shorten = (str, len) => {
  if (str.length <= len) {
    return str;
  }
  return str.slice(0, len) + "...";
};

const Wrapper = styled.div`
  border: 1px solid transparent;
  width:max-content;

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
`;

const Tag = styled.div`
  background-color: rgba(68, 152, 224, 0.1);
  padding: 10px;
  border-radius: 15%;
  color: #4498e0;
  font-size: 12px;
  font-weight: 700;
`;

const Icon = ({ success }) => {
  return (
    <div>
      {success ? (
        <i
          class="bi-check-circle large"
          style={{ fontSize: "27px", color: "rgba(130, 226, 153, 1)" }}
        ></i>
      ) : (
        <i
          class="bi-dash-circle large"
          style={{ fontSize: "27px", color: "rgba(241, 157, 56, 1)" }}
        ></i>
      )}
    </div>
  );
};

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

return (
  <Wrapper className="ndc-card p-4 d-flex flex-column gap-3 h-100">
    <div className="d-flex justify-content-between">
      <p className="text-muted small">Bounty Name</p>
      <Tag>Added days ago</Tag>
    </div>

    <p className="fw-bold" style={{ fontSize: "2rem" }}>
      {name}
    </p>
    <p className="text-muted small">Proposer</p>
    <div className="d-flex gap-2">
      <p className="fw-bold">{accountID}</p>
      <i class="bi-box-arrow-up-right"></i>
    </div>
    <div className="d-flex justify-content-center gap-4">
      <IconWrapper>
        <Icon success={true} />
        <p style={{ fontSize: "11px" }}>
          {" "}
          Proposal <br /> Phase
        </p>
      </IconWrapper>
      <IconWrapper>
        <Icon success={true} />
        <p style={{ fontSize: "11px" }}>
          {" "}
          Available
          <br /> Bounty
        </p>
      </IconWrapper>
      <IconWrapper>
        <Icon success={false} />
        <p style={{ fontSize: "11px" }}> In Progress</p>
      </IconWrapper>
      <IconWrapper>
        <Icon success={false} />
        <p style={{ fontSize: "11px" }}> Completed</p>
      </IconWrapper>
    </div>
    <p className="text-muted small">Description</p>
    <p className="overflow-hidden small">{shorten(description || "", 80)}</p>
    <div className="d-flex justify-content-between">
      <p className="text-muted small">Amount</p>
      <p></p>
    </div>
  </Wrapper>
);
