const applyFilters = props.applyFilters;
const cancel = props.cancel;
const selectedFilters = props.selectedFilters;
const filterlist = props.filterlist;

State.init({
    selectedFilters: selectedFilters
});

const setFilters = (f) => {
    State.update({
        selectedFilters: f
    });
    applyFilters(state.selectedFilters);
};

const Wrapper = styled.div`
    width: max-content;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .m-2 {
        margin: 1rem !important;
    }

    .item {
        align-items: center;
        padding-right: 5rem;
        &:hover {
            background-color: rgba(0, 0, 0, 0.04);
        }
    }

    .outline-btn {
        color: gray;
        text-decoration: underline;
        background-color: transparent;
        border: none;

        &:hover {
            background-color: transparent !important;
            border: none !important;
            color: darkgray !important;
            text-decoration: underline !important;
        }

        &:active {
            background-color: transparent !important;
            border: none !important;
            color: darkgray !important;
            text-decoration: underline !important;
        }
        &:focus-visible {
            background-color: transparent !important;
            border: none !important;
            color: darkgray !important;
            text-decoration: underline !important;
        }
    }
`;

return (
    <Wrapper className="ndc-card">
        <div>
            {filterlist?.map((item) => (
                <div
                    className="d-flex gap-4 item"
                    onClick={(event) => {
                        const data = [...state.selectedFilters];
                        if (data?.includes(event?.target?.id)) {
                            setFilters(
                                data.filter((item) => item !== event.target.id)
                            );
                        } else {
                            data.push(event.target.id);
                            setFilters(data);
                        }
                    }}
                    id={item.value}
                >
                    <input
                        id={item.value}
                        className="m-2"
                        type="checkbox"
                        value={item.value}
                        checked={
                            state.selectedFilters.includes(item.value) || false
                        }
                    />
                    <label id={item.value} className="form-check-label">
                        {item.label}
                    </label>
                </div>
            ))}
        </div>
        <button className="outline-btn" onClick={() => setFilters([])}>
            Clear Filter
        </button>
    </Wrapper>
);
