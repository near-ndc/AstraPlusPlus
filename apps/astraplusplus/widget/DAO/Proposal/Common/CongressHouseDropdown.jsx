const label = props.label;
const placeholder = props.placeholder;
const onUpdate = props.onUpdate;
const house = props.house;

const CoADaoId = props.dev
    ? "/*__@replace:CoADaoIdTesting__*/"
    : "/*__@replace:CoADaoId__*/";
const VotingBodyDaoId = props.dev
    ? "/*__@replace:VotingBodyDaoIdTesting__*/"
    : "/*__@replace:VotingBodyDaoId__*/";
const TCDaoId = props.dev
    ? "/*__@replace:TCDaoIdTesting__*/"
    : "/*__@replace:TCDaoId__*/";
const HoMDaoId = props.dev
    ? "/*__@replace:HoMDaoIdTesting__*/"
    : "/*__@replace:HoMDaoId__*/";

State.init({
    house: house ? { text: house, value: house } : null
});

return (
    <div className="mb-3">
        <Widget
            src={`sking.near/widget/Common.Inputs.Select`}
            props={{
                label: label,
                noLabel: false,
                placeholder: placeholder,
                options: [
                    { text: CoADaoId, value: CoADaoId },
                    { text: HoMDaoId, value: HoMDaoId },
                    { text: TCDaoId, value: TCDaoId }
                ],
                value: state.house,
                onChange: (house) => {
                    onUpdate(house.value);
                    State.update({
                        house: house
                    });
                },
                error: undefined
            }}
        />
    </div>
);
