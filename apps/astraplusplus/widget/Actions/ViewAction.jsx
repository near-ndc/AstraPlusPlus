const { router, id } = props;
const actionLink = `#//*__@appAccount__*//widget/home?page=actions`;

const res = fetch(
  `https://api.app.astrodao.com/api/v1/proposals/templates?filter[0]=id||$eq||${id}&limit=1000&offset=0&join=daos||id`
);
const url = `https://near.org//*__@appAccount__*//widget/home?page=dao&tab=action&id=${id}`;

const twitterURL = new URL("https://twitter.com/intent/tweet");
twitterURL.searchParams.append("text", "Sharing a DAO template from Astra++");
twitterURL.searchParams.append("url", url);

const telegramURL = new URL("https://t.me/share/url");
telegramURL.searchParams.append("url", url);
telegramURL.searchParams.append("text", "Sharing a DAO template from Astra++");
const [isExpanded, setIsExpanded] = useState(false);
const [copied, setCopied] = useState(false);

const socialMedia = [
  {
    name: "Share",
    link: url.toString(),
    icon: "bi bi-share",
    copyLink: true
  },
  {
    name: "Twitter",
    link: twitterURL.toString(),
    icon: "bi bi-twitter"
  },

  {
    name: "Telegram",
    link: telegramURL.toString(),
    icon: "bi bi-telegram"
  }
];

const Wrapper = styled.div`
  .social_button {
    height: 2.5em;
    width: 2.5em;
    border-radius: 0.5rem;
    color: #4498e0;
    border: 1px solid #4498e0;
    transition: all 200ms ease;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }

  .text-sm {
    font-size: 13px;
  }

  .flex-3 {
    flex: 3;
  }

  .flex-2 {
    flex: 2;
  }

  .flex-1 {
    flex: 1;
  }

  .gap-6 {
    gap: 3.5rem;
  }

  label {
    color: #828688;
    margin-bottom: 0.5rem;
  }
`;

useEffect(() => {
  let timeoutId;

  if (copied) {
    timeoutId = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return () => {
    clearTimeout(timeoutId);
  };
}, [copied]);

const copyToClipboard = (link) => {
  clipboard.writeText(link);
  setCopied(true);
};

const data = res?.body?.data?.[0];

return (
  <Wrapper className="d-flex flex-column gap-4">
    <Widget
      src="near/widget/DIG.Toast"
      props={{
        title: "Copied",
        open: copied
      }}
    />
    <a
      className="text-muted mb-3"
      href={actionLink}
      onClick={(e) => {
        router.navigate({
          page: "actions"
        });
      }}
    >
      <i class="bi bi-chevron-left"></i>
      Back to Actions Library
    </a>
    {res === null || !Array.isArray(res.body.data) ? (
      <Widget src="nearui.near/widget/Feedback.Spinner" />
    ) : (
      <div className="d-flex flex-column gap-6">
        <div className="d-flex justify-content-between gap-2">
          <div>
            <h4>{data?.name}</h4>
            <div className="text-muted text-sm">{data?.createdBy}</div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            {socialMedia.map((item, index) =>
              item.copyLink ? (
                <div
                  className="social_button"
                  onClick={() => copyToClipboard(item.link)}
                >
                  <i className={item.icon}></i>
                </div>
              ) : (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Share to ${item.name}`}
                  className="social_button"
                >
                  <i className={item.icon}></i>
                </a>
              )
            )}
            <Widget
              src="/*__@appAccount__*//widget/Actions.UseInDao"
              props={{
                templateId: id
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between gap-2">
          <div className="flex-2">
            <label>Used in DAOs</label>
            <div className="d-flex flex-column">
              {Array.isArray(data?.daos) &&
                data.daos.map(({ id }) => (
                  <a
                    className="fw-bold"
                    href={`https://nearblocks.io/address/${id}`}
                  >
                    {id}
                  </a>
                ))}
            </div>
          </div>
          <div className="flex-3 ndc-card rounded-3">
            <div className="d-flex w-100 h-100">
              <div
                className="h-100 rounded-start-3"
                style={{ width: "30px", backgroundColor: "#4498e0" }}
              ></div>
              <div className="p-4 d-flex flex-column gap-4 flex-1">
                <div>
                  <label>Template Name</label>
                  <div className="fw-bold">{data.name}</div>
                </div>
                <div className="d-flex gap-4">
                  <div className="flex-1 text-truncate">
                    <label>Smart Contract Address</label>
                    <div
                      className="fw-bold text-truncate"
                      style={{ width: "90%" }}
                    >
                      {data.config.smartContractAddress}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label>Method</label>
                    <div className="fw-bold">{data.config.methodName}</div>
                  </div>
                </div>
                <div className="d-flex gap-4">
                  <div className="flex-1">
                    <label>Description</label>
                    <div className="fw-bold">{data.description}</div>
                  </div>
                  <div className="flex-1">
                    <label>Tgas</label>
                    <div className="fw-bold">
                      {Big(data.config.actionsGas)
                        .div(Big(10).pow(12))
                        .toFixed()}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <div className="text-muted">JSON</div>
                  <Widget
                    src="nearui.near/widget/Input.Button"
                    props={{
                      children: (
                        <>
                          View More{" "}
                          {isExpanded ? (
                            <i class="bi bi-chevron-up"></i>
                          ) : (
                            <i class="bi bi-chevron-down"></i>
                          )}
                        </>
                      ),
                      variant: "info",
                      size: "md",
                      onClick: (e) => {
                        setIsExpanded(!isExpanded);
                      }
                    }}
                  />
                </div>
                {isExpanded && (
                  <div style={{ backgroundColor: "#EFEFEF" }} className="p-4">
                    {data.config.json}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </Wrapper>
);
