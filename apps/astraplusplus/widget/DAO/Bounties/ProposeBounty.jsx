const daoId = props.daoId;
const accountId = context.accountId;

const [isModalOpen, setModalOpen] = useState(false);

const Container = styled.div`
  label {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 5px;
  }
`;

return (
  <Container>
    <Widget
      src="/*__@appAccount__*//widget/Common.Layout.CardModal"
      props={{
        title: "Propose bounty",
        onToggle: () => setModalOpen(!isModalOpen),
        isOpen: isModalOpen,
        toggle: (
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: (
                <>
                  Propose bounty
                  <i className="bi bi-16 bi-plus-lg"></i>
                </>
              ),
              variant: "info",
              size: "sm"
            }}
          />
        ),
        content: (
          <div
            className="d-flex flex-column gap-2 align-items-stretch"
            style={{
              width: "800px",
              maxWidth: "100vw"
            }}
          >
            <Widget
              src="/*__@appAccount__*//widget/DAO.Bounties.CreateForm"
              props={{ ...props, onCancel: () => setModalOpen(false) }}
            />
          </div>
        )
      }}
    />
  </Container>
);
