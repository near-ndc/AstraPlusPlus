const { proposals, resPerPage, state, update } = props;

const formatDate = (date) => {
  date = new Date(Date(date));
  return `${
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;
};

const renderRow = (proposal, proposal_type, proposal_id, i) => {
  return (
    <tr>
      <th scope="row">
        <span className="id-value">#{proposal_id}</span>
      </th>
      <td>{formatDate(proposal.submission_time)}</td>
      <td>
        <Widget
          src="nearui.near/widget/Element.User"
          props={{
            accountId: proposal.proposer,
            options: {
              showImage: false,
              shortenLength: 12,
              fontSize: 13,
            },
          }}
        />
      </td>
      <td>{proposal_type}</td>
      <td>{proposal.status}</td>
      <td>
        <Widget
          src="nearui.near/widget/Layout.Modal"
          props={{
            toggle: (
              <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                  children: "More details",
                  variant: "info",
                }}
              />
            ),
            content: (
              <Widget
                src="astraplusplus.ndctools.near/widget/DAO.Proposals.Card.index"
                props={{
                  daoId: state.daoId,
                  proposalString: JSON.stringify(proposal),
                  multiSelectMode: state.multiSelectMode,
                }}
              />
            ),
          }}
        />
      </td>
    </tr>
  );
};

const Table = styled.div`
  font-size: 13px;
  font-weight: 600;

  td,
  th {
    vertical-align: middle;
  }

  tr {
    height: 58px;
  }

  .id-value {
    border: 1px solid #4498e0;
    color: #4498e0;
    padding: 4px 8px;
    background: rgba(68, 152, 224, 0.1);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
  }
`;

return (
  <Table
    class="table-responsive my-3"
    style={{
      height: 65 * (proposals?.length ?? resPerPage),
    }}
  >
    {proposals === null ? (
      <>
        <Widget src="nearui.near/widget/Feedback.Spinner" />
      </>
    ) : (
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Date</th>
            <th scope="col">Proposer</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {proposals !== null &&
            proposals.map(({ proposal, proposal_type, proposal_id }, i) => {
              proposal.kind = {
                [proposal_type]: {
                  ...proposal.kind,
                },
              };
              proposal.id = proposal_id;
              if (proposal.status === "Removed") return <></>;
              Object.keys(proposal.vote_counts).forEach((k) => {
                if (typeof proposal.vote_counts[k] == "string") {
                  proposal.vote_counts[k] = proposal.vote_counts[k]
                    .match(/.{1,2}/g)
                    .map((x) => parseInt(x));
                }
              });
              return renderRow(proposal, proposal_type, proposal_id, i);
            })}
        </tbody>
      </table>
    )}
  </Table>
);
