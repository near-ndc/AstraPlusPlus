const sortList = [
  {
    label: "Newest",
    value: "createdAt,DESC"
  },
  {
    label: "Oldest",
    value: "createdAt,ASC"
  }
];

const [searchTerm, setSearch] = useState(null);
const [isFiltersOpen, setFiltersOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(0);
const [selectedSort, setSelectedSort] = useState(sortList[0].value);

const resPerPage = 20;

const forgeUrl = (params) => {
  let url = "https://api.app.astrodao.com/api/v1/proposals/templates?";
  Object.entries(params).forEach(([key, value]) => {
    let paramValue = value;
    if (key === "s") {
      paramValue = encodeURIComponent(JSON.stringify(value));
    } else if (key === "sort") {
      paramValue = encodeURIComponent(value);
    }
    if (paramValue !== undefined && paramValue !== null && paramValue !== "") {
      url += `${key}=${paramValue}&`;
    }
  });
  return url;
};

const res = fetch(
  forgeUrl({
    offset: currentPage * resPerPage,
    limit: resPerPage,
    join: "daos||id",
    sort: selectedSort,
    s: { $and: [{ name: { $contL: searchTerm || "" } }] }
  })
);

const Wrapper = styled.div`
  table {
    overflow-x: auto;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  @media screen and (max-width: 1000px) {
    table {
      display: block;
    }
  }

  th,
  td {
    padding: 10px;
    text-align: left;
  }

  tr {
    border-bottom: 1px solid lightgray;
  }

  thead {
    border-bottom: 2px solid #4498e0;
    font-size: 16px;
  }

  .icons-color i {
    color: #4498e0;
  }

  .text-sm {
    font-size: 12px;
  }

  .font-weight-bold {
    font-weight: bold;
  }

  .text-primary {
    color: #4498e0 !important;
  }

  .selected {
    background-color: #4498e0 !important;
    color: white !important;
  }
`;
return (
  <Wrapper className="d-flex flex-column gap-1">
    <h2>Actions Library</h2>
    <p className="text-muted">
      Add new functionality and power up your workflow with these templates.
    </p>
    <div className="d-flex justify-content-between gap-3 icons-color">
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          value: searchTerm,
          placeholder: "Search by template name",
          onChange: setSearch,
          icon: (
            <i
              className="bi bi-search"
              style={{
                color: "#4498e0 !important"
              }}
            />
          )
        }}
      />
      <Widget
        src="nearui.near/widget/Layout.Popover"
        props={{
          triggerComponent: (
            <Widget
              src="nearui.near/widget/Input.Button"
              props={{
                style: {
                  color: "#4498e0"
                },
                children: (
                  <>
                    Sort:{" "}
                    {sortList.find((item) => item.value === selectedSort).label}{" "}
                    <i class="bi bi-caret-down"></i>
                  </>
                ),
                variant: "info outline ",
                size: "md"
              }}
            />
          ),
          content: (
            <Widget
              src="/*__@appAccount__*//widget/Common.Modals.ViewDropDown"
              props={{
                viewList: sortList,
                cancel: () => {},
                applyView: (sort) => {
                  setSelectedSort(sort);
                },
                selectedView: selectedSort
              }}
            />
          )
        }}
      />
    </div>
    {res === null || !Array.isArray(res.body.data) ? (
      <Widget src="nearui.near/widget/Feedback.Spinner" />
    ) : (
      <div className="mt-4" style={{ overflow: "auto", maxWidth: "100%" }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Smart Contracts </th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ position: "relative" }}>
            {res.body.data.map((item) => {
              const address = item.config.smartContractAddress;
              return (
                <tr>
                  <td>
                    <div style={{ maxWidth: 500 }}>
                      <h6 className="font-weight-bold mb-0">{item.name}</h6>
                      <p className="text-sm text-muted">{item.description}</p>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: 300 }} className="text-truncate">
                      <a
                        className="text-primary text-decoration-underline"
                        href={`https://nearblocks.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {address}
                      </a>
                    </div>
                  </td>
                  <td>
                    <Widget
                      src="nearui.near/widget/Input.Button"
                      props={{
                        children: "Use in DAO",
                        variant: "info",
                        size: "md"
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <Widget
            src="nearui.near/widget/Navigation.Paginate"
            props={{
              pageSize: resPerPage,
              currentPage: currentPage === 0 ? 1 : currentPage,
              totalPageCount: res?.body?.total / resPerPage ?? 1,
              onPageChange: (page) => {
                setCurrentPage(page);
              },
              revaluateOnRender: true
            }}
          />
        </div>
      </div>
    )}
  </Wrapper>
);
