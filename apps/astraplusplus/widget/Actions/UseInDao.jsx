return (
  <Widget
    src="/*__@appAccount__*//widget/Layout.Modal"
    props={{
      content: (
        <div
          style={{ minWidth: "400px", minHeight: "200px" }}
          className="ndc-card d-flex flex-column gap-2 p-4"
        >
          <h4>Actions Library</h4>
          <div className="text-muted">
            Only councils can save templates to their DAOs
          </div>
          <div>
            <label>Select the DAO</label>
            <select></select>
          </div>
          <div className="d-flex justify-content-end">
            <Widget
              src="nearui.near/widget/Input.Button"
              props={{
                children: "Confirm",
                variant: "info",
                size: "md"
              }}
            />
          </div>
        </div>
      ),
      toggle: (
        <Widget
          src="nearui.near/widget/Input.Button"
          props={{
            children: "Use in DAO",
            variant: "info",
            size: "md"
          }}
        />
      )
    }}
  />
);
