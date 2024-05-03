const { id, daoId } = props;
const actionLink = `#//*__@appAccount__*//widget/home?tab=bounties&daoId=${daoId}&page=dao`;
const bountyDetail = Near.view(daoId, "get_bounty", {
  id: parseInt(id)
});

if (!bountyDetail) {
  <Widget src="nearui.near/widget/Feedback.Spinner" />;
}

const Container = styled.div``;

return (
  <div>
    <a className="text-muted mb-3" href={actionLink}>
      <i class="bi bi-chevron-left"></i>
      Back to bounties
    </a>
    <hr />
  </div>
);
