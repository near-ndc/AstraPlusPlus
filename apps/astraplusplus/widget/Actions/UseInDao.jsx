const publicApiKey = "/*__@replace:pikespeakApiKey__*/";
const templateId = props.templateId;
const accountId = context.accountId ?? "";

const [selectedDao, setSelectedDao] = useState(null);
const [toastMessage, setToastMessage] = useState("");
const [modalOpen, setModalOpen] = useState(false);

const forgeUrl = (apiUrl, params) =>
  apiUrl +
  Object.keys(params)
    .sort()
    .reduce((paramString, p) => paramString + `${p}=${params[p]}&`, "?");

const daos = useCache(
  () =>
    asyncFetch(forgeUrl(`https://api.pikespeak.ai/daos/members`, {}), {
      mode: "cors",
      headers: {
        "x-api-key": publicApiKey
      }
    }).then((res) => {
      return res.body[accountId]["daos"].map((dao) => ({
        contract_id: dao
      }));
    }),
  "use-in-my-daos-" + accountId,
  { subscribe: false }
);

const Select = styled.select`
  border: none;
  background: transparent;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  font-weight: 500;
  width: 100%;
  border-radius: inherit;
  padding: ${({ size }) =>
    size === "sm" ? "0 15px" : size === "lg" ? "0 23px" : "0 18px"};
  height: ${({ size }) =>
    size === "sm" ? "32px" : size === "lg" ? "40px" : "36px"};

  option {
    font-size: inherit;
    color: inherit;
    font-family: inherit;
    font-weight: 500;
  }
`;

function onSave() {
  const publicKey = "";
  const signature = "";
  if (selectedDao && templateId) {
    const buff = Buffer.from(`${accountId}|${publicKey}|${signature}`);
    asyncFetch(
      `https://api.app.astrodao.com/api/v1/proposals/templates/${templateId}/clone/${selectedDao}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${buff.toString("base64")}`
        },
        body: JSON.stringify({
          templateId: templateId,
          targetDao: selectedDao
        })
      }
    )
      .then((res) => {
        console.log("res:", res);
        setToastMessage("Templated saved to your DAO.");
        setModalOpen(false);
      })
      .catch((err) => {
        console.log("err:", err);
        setToastMessage("Error occured, Please try again later.");
        setModalOpen(false);
      });
  }
}

useEffect(() => {
  let timeoutId;

  if (toastMessage) {
    timeoutId = setTimeout(() => {
      setToastMessage("");
    }, 2000);
  }

  return () => {
    clearTimeout(timeoutId);
  };
}, [toastMessage]);

return (
  <>
    <Widget
      src="near/widget/DIG.Toast"
      props={{
        title: toastMessage,
        open: toastMessage,
        type: toastMessage.includes("Error") ? "error" : "info"
      }}
    />

    <Widget
      src="/*__@appAccount__*//widget/Layout.Modal"
      props={{
        open: modalOpen,
        content: (
          <div
            style={{ minWidth: "400px", minHeight: "200px" }}
            className="ndc-card d-flex flex-column gap-2 p-4"
          >
            <h4>Actions Library</h4>
            <Widget
              src="/*__@replace:nui__*//widget/Element.Badge"
              props={{
                children: "Only councils can save templates to their DAOs.",
                variant: `disabled`,
                size: "lg"
              }}
            />
            {daos.length > 0 ? (
              <div className="d-flex flex-column mt-1 gap-1">
                <label>Select the DAO</label>
                <Select
                  onChange={({ target: { value } }) => {
                    setSelectedDao(value);
                  }}
                  value={selectedDao}
                >
                  <option value={null}>Select your DAO</option>
                  {daos.map(({ contract_id }) => (
                    <option value={contract_id}>{contract_id}</option>
                  ))}
                </Select>
                <div className="d-flex justify-content-end mt-3">
                  <Widget
                    src="nearui.near/widget/Input.Button"
                    props={{
                      children: "Confirm",
                      variant: "info",
                      size: "md",
                      disabled: !selectedDao,
                      onClick: onSave
                    }}
                  />
                </div>
              </div>
            ) : (
              "Sorry, you are not a member of any DAO council."
            )}
          </div>
        ),
        toggle: (
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: "Use in DAO",
              variant: "info",
              size: "md",
              onClick: () => setModalOpen(true)
            }}
          />
        )
      }}
    />
  </>
);
