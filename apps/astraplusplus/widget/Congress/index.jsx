const { router, house } = props;
const accountId = props.accountId ?? context.accountId ?? "";

const HOM_IMG =
    "https://ipfs.near.social/ipfs/bafkreidqibol2yjcaja7hdivezfumbb323niqz6csntmeyrscl2iym5vrm";
const COA_IMG =
    "https://ipfs.near.social/ipfs/bafkreifh4j3tc5klc3mjkfx7prced4rbxm2xel2qoz2sr3ekoxez53ik2m";
const TC_IMG =
    "https://ipfs.near.social/ipfs/bafkreif3aql3iceqrmbkyvoxnvh3elo3sodbvxsaok6qzpjxaqnzuejwni";
const VB_IMG =
    "https://ipfs.near.social/ipfs/bafkreigbn55gk57jzzuvae3rbdeoqzvhy2ikggjhwc6dcfwlbx74s4u5v4";
const VB_TRUST_IMG =
    "https://ipfs.near.social/ipfs/bafkreiegx5ygl7vpp5fblgyapnhgevqdpyh3lrucw6d5boqi7bikt4q7iq";

const Content = {
    hom: {
        title: "House of Merit",
        abbr: "HoM",
        address: "hom.gwg-testing.near",
        color: "#5BC65F",
        description:
            "The House of Merit is in charge of allocating the treasury and deploying capital for the growth of the ecosystem.",
        metadata: {
            groups: 1,
            powers: [
                {
                    text: "The House of Merit can propose setup package, budget, large budget items, and recurring budget items.",
                    description:
                        "The vote needs 8 approvals to pass the HoM. The Voting Body can veto during the cooldown period."
                },
                {
                    text: "The House of Merit can propose motions, including motions to amend the governance framework and to hire, provided that these motions are not vetoed by the Council of Advisors.",
                    description:
                        "The vote needs 8 approvals to pass the HoM. The Council of Advisors can veto during the proposal cooldown period, or create a text proposal to veto a House of Merit proposal that is past the cooldown period."
                }
            ],
            checks: [
                {
                    house: "coa",
                    text: "The Council of Advisors can veto any HoM proposals, except setup package, budget, large budget items, and recurring budget items."
                },
                {
                    house: "vb",
                    text: "The Voting Body must rectify setup package and budget, and can veto large budget items and recurring budget items.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    house: "vb",
                    text: "The Voting Body can vote to dissolve the House of Merit.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    house: "tc",
                    text: "The Transparency Commission can remove members of the House of Merit.",
                    description:
                        "The vote needs a simple majority. When 8 members from the House of Merit are removed, the house is dissolved and a new House of Merit is elected."
                }
            ]
        }
    },
    coa: {
        title: "Council of Advisors",
        abbr: "CoA",
        address: "coa.gwg-testing.near",
        color: "#4498E0",
        description:
            "The Council of Advisors is in charge of vetoing proposals from the HoM and guiding the deployment of the treasury.",
        metadata: {
            groups: 1,
            powers: [
                {
                    text: "All proposals originated from the House of Merit (except the Setup Package and Budget) can be vetoed by the Council of Advisors.",
                    description: "The vote needs 4 approvals to pass the CoA."
                },
                {
                    text: "Council of Advisors could reinstate and unban a member previously dismissed and banned by the Transparency Commission.",
                    description: "The vote needs 4 approvals to pass the CoA."
                }
            ],
            checks: [
                {
                    house: "vb",
                    text: "The Voting Body can vote to dissolve the Council of Advisors.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    house: "tc",
                    text: "The Transparency Commission can remove members of the Council of Advisors.",
                    description:
                        "The vote needs 4 approvals to pass the TC. When 4 members from the Council of Advisors are removed, the house is dissolved and a new Council of Advisor is elected."
                }
            ]
        }
    },
    tc: {
        title: "Transparency Commission",
        abbr: "TC",
        address: "tc.gwg-testing.near",
        color: "#F19D38",
        description:
            "The Transparency Commission is In charge of keeping behavior of elected officials clean, and making sure cartels do not form in the ecosystem.",
        metadata: {
            funds: "10M",
            groups: 1,
            powers: [
                {
                    text: "The Transparency Commission can conduct investigations on Congressional members.",
                    description: "The vote needs 4 approvals to pass TC."
                },
                {
                    text: "The Transparency Commission has the power to investigate, dismiss, and ban members of House of Merit.",
                    description: "The vote needs 4 approvals to pass TC."
                },
                {
                    text: "The Transparency Commission has the power to investigate, dismiss, and ban members of Council of Advisors.",
                    description: "The vote needs 4 approvals to pass TC."
                },
                {
                    text: "The Transparency Commission has the power to investigate, dismiss, and ban members of Transparency Commission.",
                    description: "The vote needs 4 approvals to pass TC."
                }
            ],
            checks: [
                {
                    house: "coa",
                    text: "Council of Advisors could reinstate and unban a member previously dismissed and banned by the Transparency Commission."
                },
                {
                    house: "vb",
                    text: "The Voting Body can vote to dissolve the Transparency Commission.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    house: "tc",
                    text: "The Transparency Commission can dismiss and ban members of the Transparency Commission.",
                    description:
                        "The vote needs 4 votes to pass the TC. When 4 members from the Transparency Commission are removed, the house is dissolved and a Transparency Commission is elected."
                }
            ]
        }
    },
    vb: {
        title: "Voting Body",
        abbr: "VB",
        address: "vb.gwg-testing.near",
        color: "#F29BC0",
        description:
            "The Voting Body consists all fair voters who participated in the inaugural NDC elections and received a “I Voted” Soul Bound Token. ",
        metadata: {
            funds: "10M",
            groups: 1,
            powers: [
                {
                    text: "The Voting Body must ratify Set Up Package.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    text: "The Voting Body may veto large budget items and recurring budget items.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    text: "The Voting Body may report activities to be investigated by the Transparency Commission.",
                    description:
                        "The Voting Body may bring issues to the Transparency Commission."
                },
                {
                    text: "The Voting Body may vote to dissolve the House of Merit, Council of Advisors, and the Transparency Commission.",
                    description:
                        "The vote needs a NEAR Consent, which is 7% of voting body participating with a simple majority approval."
                },
                {
                    text: "The Voting Body may motion to amend the governance framework.",
                    description:
                        "The vote needs a NEAR Supermajority Consent, which is 12% of voting body participating with a supermajority of 60% approval."
                },
                {
                    text: "The Voting Body may motion to amend the legal framework of the Trust Instrument.",
                    description:
                        "The vote needs a NEAR Supermajority Consent, which is 12% of voting body participating with a supermajority of 60% approval."
                }
            ],
            checks: null
        }
    }
};

const Container = styled.div`
    background: rgba(217, 217, 217, 0.3);
    color: #464c50;
    font-size: 14px;
    line-height: 24px;

    h5,
    h6 {
        margin: 0;
    }
`;

const HousePanel = styled.div`
    background-color: #fff;
`;

const CircleLogo = styled.div`
    height: 65px;
    width: 65px;
    border-radius: 50%;
    border: 5px solid;
    background: black;
    color: white;
    text-transform: uppercase;
    border-color: ${Content[state.selectedHouse].color};
`;

const CircleLogoSmall = styled.div`
    height: 30px;
    min-width: 30px;
    border-radius: 50%;
    border: 2px solid;
    font-weight: 700;
    background: black;
    color: white;
    font-size: 11px;
    text-transform: uppercase;
    border-color: ${(props) => Content[props.house].color};
`;

const Info = styled.div`
    border-radius: 4px;
    border: 0.75px solid #d3d3d3;
    background: rgba(0, 0, 0, 0.05);
`;

const Tab = styled.div`
    padding: 4px 10px;
    gap: 5px;
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 50px;
    background: ${(props) => (props.selected ? "#F4F4F4" : "transparent")};
    border: 1px solid;
    border-color: ${(props) => (props.selected ? "#d9d9d9" : "transparent")};
    color: ${(props) => (props.selected ? "#000" : "inherit")};

    &:hover {
        cursor: pointer;
    }

    .circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #d4d4d4;
        padding: 4px;
    }
`;

const Section = styled.div`
    padding: 25px;

    @media (max-width: 768px) {
        padding: 25px 5px;
    }
`;

const UserIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 25px;
    height: 25px;
    border-radius: 50%;
    background: ${(props) => props.color};
    padding-right: 1px;
`;

const Hr = styled.div`
    width: 1px;
    height: 25px;
    background: #d9d9d9;
`;

const Description = styled.div`
    line-height: 18px;
`;

const Tabs = styled.div`
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 0.4);
    background: rgba(217, 217, 217, 0.1);
    display: flex;
    padding: 20px 14px;
    gap: 20px;
`;

const Img = styled.img`
    width: 90%;
`;

const ImgContainer = styled.div`
    @media (max-width: 768px) {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
`;

const DropdownContainer = styled.div`
    display: flex;
    position: absolute;
    right: -25px;
    top: 15px;
    z-index: 1;
    padding: 15px;
    min-width: 265px;

    .dropdown-content {
        border-radius: 4px;
        min-width: 230px;
        background-color: #fff;
        font-size: 14px;

        div,
        a {
            padding: 8px 12px;
            &:hover {
                background: #f8f9fa;
                cursor: pointer;
            }
        }
    }
`;

State.init({
    selectedHouse: house ?? "hom",
    selectedTab: "powers",
    copied: false,
    proposals: [],
    members: [],
    showPowerChecksDescription: false,
    vbWithTrust: false,
    proposalsCount: 0,
    hideProposalBtn: true,
    showOptions: false,
    showHouses: false
});

const getProposalsCount = () => {
    const proposalsCount = Near.view(
        Content[state.selectedHouse].address,
        "number_of_proposals",
        {}
    );
    State.update({ proposalsCount });
};

const changeHouse = (house) => {
    State.update({
        selectedHouse: house,
        selectedTab: "powers",
        showPowerChecksDescription: false,
        vbWithTrust: false
    });
};

const getProposals = () => {
    const proposals = Near.view(
        Content[state.selectedHouse].address,
        "get_proposals",
        { from_index: 0, limit: 20 }
    );

    State.update({ proposals: proposals ?? [] });
};

const getMembers = () => {
    const resp = Near.view(
        Content[state.selectedHouse].address,
        "get_members",
        {}
    );
    const isMember = resp?.members?.includes(accountId);
    State.update({ members: resp?.members ?? [], hideProposalBtn: !isMember });
};

getProposalsCount();
getProposals();
getMembers();

const ContentBlock = ({ title, abbr, address, description, metadata }) => (
    <Section className="d-flex flex-column justify-content-between h-100">
        <div className="d-flex flex-column bg-white gap-3">
            <div className="d-flex justify-content-between">
                <CircleLogo className="d-flex justify-content-center align-items-center">
                    <h6>
                        <b>{abbr}</b>
                    </h6>
                </CircleLogo>

                <div className="mt-1 px-2">
                    <Widget
                        src="near/widget/DIG.DropdownMenu"
                        props={{
                            trigger: (
                                <Widget
                                    src="nearui.near/widget/Input.Button"
                                    props={{
                                        children: (
                                            <i className="bi bi-three-dots"></i>
                                        ),
                                        variant: "icon rounded"
                                    }}
                                />
                            ),
                            items: [
                                {
                                    name: "Proposals",
                                    href: `#//*__@appAccount__*//widget/home?page=dao&daoId=${
                                        Content[state.selectedHouse].address
                                    }`
                                },
                                {
                                    name: "Members",
                                    href: `#//*__@appAccount__*//widget/home?page=dao&daoId=${
                                        Content[state.selectedHouse].address
                                    }&tab=members`
                                }
                            ]
                        }}
                    />
                </div>
            </div>
            <div>
                <div className="d-flex">
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <div className="mt-1 px-2">
                        <Widget
                            src="near/widget/DIG.DropdownMenu"
                            props={{
                                trigger: (
                                    <i className="bi bi-caret-down-fill" />
                                ),
                                items: [
                                    {
                                        name: Content.hom.title,
                                        onSelect: () => changeHouse("hom"),
                                        href: "#//*__@appAccount__*//widget/home?page=congress&house=hom"
                                    },
                                    {
                                        name: Content.coa.title,
                                        onSelect: () => changeHouse("coa"),
                                        href: "#//*__@appAccount__*//widget/home?page=congress&house=coa"
                                    },
                                    {
                                        name: Content.tc.title,
                                        onSelect: () => changeHouse("tc"),
                                        href: "#//*__@appAccount__*//widget/home?page=congress&house=tc"
                                    },
                                    {
                                        name: Content.vb.title,
                                        onSelect: () => changeHouse("vb"),
                                        href: "#//*__@appAccount__*//widget/home?page=congress&house=vb"
                                    }
                                ]
                            }}
                        />
                    </div>
                </div>
                <span className="text-secondary">
                    <b id="address">{address}</b>
                </span>
                <i
                    className={state.copied ? "bi-check-lg" : "bi bi-clipboard"}
                    role="button"
                    onClick={() => {
                        clipboard
                            .writeText(address)
                            .then(() => State.update({ copied: true }));
                    }}
                />
            </div>
            <div>
                <span className="text-secondary">{description}</span>
            </div>
            <div className="d-flex justify-content-around my-4">
                <div className="text-center">
                    <h5 className="mb-0">
                        <b>
                            {state.members.length}/{1}
                        </b>
                    </h5>
                    <span className="text-secondary">
                        <b>Members / Groups</b>
                    </span>
                </div>
                <div className="text-center">
                    <h5 className="mb-0">
                        <b>
                            {
                                state.proposals.filter(
                                    (p) => p.status === "InProgress"
                                ).length
                            }
                            /{state.proposalsCount}
                        </b>
                    </h5>
                    <span className="text-secondary">
                        <b>Active / Total Proposals</b>
                    </span>
                </div>
            </div>
            <Tabs className="flex-column mb-4">
                <div className="d-flex flex-column flex-sm-row gap-3">
                    <Tab
                        onClick={() => State.update({ selectedTab: "powers" })}
                        selected={state.selectedTab === "powers"}
                    >
                        <div>Powers</div>
                        <div className="circle d-flex justify-content-center align-items-center">
                            <div>{metadata.powers.length}</div>
                        </div>
                    </Tab>
                    {metadata.checks && (
                        <Tab
                            onClick={() =>
                                State.update({ selectedTab: "checks" })
                            }
                            selected={state.selectedTab === "checks"}
                        >
                            <div>
                                Checks on {Content[state.selectedHouse].abbr}
                            </div>
                            <div className="circle d-flex justify-content-center align-items-center">
                                <div>{metadata.checks.length}</div>
                            </div>
                        </Tab>
                    )}
                    <Tab
                        onClick={() =>
                            State.update({ selectedTab: "proposals" })
                        }
                        selected={state.selectedTab === "proposals"}
                    >
                        <div>Proposals</div>
                        <div className="circle d-flex justify-content-center align-items-center">
                            <div>{state.proposalsCount}</div>
                        </div>
                    </Tab>
                </div>
                <div className="d-flex flex-column gap-4 p-3">
                    {state.selectedTab === "powers" &&
                        metadata.powers.map((r, i) => (
                            <PowerChecksDescription
                                key={i}
                                index={i + 1}
                                house={state.selectedHouse}
                                text={r.text}
                                description={r.description}
                                type={"power"}
                            />
                        ))}
                    {state.selectedTab === "checks" &&
                        metadata.checks.map((c, i) => (
                            <PowerChecksDescription
                                key={i}
                                index={i + 1}
                                house={c.house}
                                text={c.text}
                                description={c.description}
                            />
                        ))}
                    {state.selectedTab === "proposals" && (
                        <Widget
                            src="/*__@appAccount__*//widget/DAO.Proposals.Congress.index"
                            props={{
                                daoId: Content[state.selectedHouse].address
                            }}
                        />
                    )}
                </div>
            </Tabs>
        </div>

        {!state.hideProposalBtn && (
            <div className="d-flex justify-content-end gap-2">
                <Widget
                    src="nearui.near/widget/Social.FollowButton"
                    props={{
                        variant: "info outline",
                        accountId: state.selectedHouse
                    }}
                />
                <Widget
                    src="/*__@appAccount__*//widget/Common.Layout.CardModal"
                    props={{
                        title: "Create Proposal",
                        onToggle: () =>
                            State.update({
                                isProposalModalOpen: !state.isProposalModalOpen
                            }),
                        isOpen: state.isProposalModalOpen,
                        toggle: (
                            <Widget
                                src="nearui.near/widget/Input.Button"
                                props={{
                                    children: (
                                        <>
                                            Create Proposal
                                            <i className="bi bi-16 bi-plus-lg"></i>
                                        </>
                                    ),
                                    variant: "info"
                                }}
                            />
                        ),
                        content: (
                            <div
                                className="d-flex flex-column align-items-stretch"
                                style={{
                                    width: "800px",
                                    maxWidth: "100vw"
                                }}
                            >
                                <Widget
                                    src={
                                        "/*__@appAccount__*//widget/DAO.Proposal.Create"
                                    }
                                    props={{
                                        daoId: `${state.selectedHouse}.gwg-testing.near`
                                    }}
                                />
                            </div>
                        )
                    }}
                />
            </div>
        )}
    </Section>
);

const PowerChecksDescription = ({ house, index, text, description, type }) => (
    <div className="d-flex gap-3">
        {type === "power" ? (
            <UserIcon color={Content[state.selectedHouse].color}>
                <img
                    width={11}
                    src="https://ipfs.near.social/ipfs/bafkreig7hd3ysbcb7dkvgzhaavltjvaw5pjtaqyj4qdbamwxhhh4yqp4su"
                />
            </UserIcon>
        ) : (
            <CircleLogoSmall
                house={house}
                className="d-flex justify-content-center align-items-center"
            >
                <small>{house}</small>
            </CircleLogoSmall>
        )}
        <Hr />
        <div className="d-flex justify-content-between gap-2">
            <Description>
                <small>{text}</small>
                {state.showPowerChecksDescription === index && (
                    <Description className="mt-2">
                        <small className="text-secondary">
                            {description ?? "The vote needs a simple majority."}
                        </small>
                    </Description>
                )}
            </Description>
            <i
                class={
                    state.showPowerChecksDescription === index
                        ? "bi bi-chevron-up"
                        : "bi bi-chevron-down"
                }
                role="button"
                onClick={() =>
                    State.update({
                        showPowerChecksDescription:
                            state.showPowerChecksDescription === index
                                ? false
                                : index
                    })
                }
            ></i>
        </div>
    </div>
);

const statusMap = {
    InProgress: {
        text: "In Progress",
        color: "primary",
        icon: "bi bi-arrow-clockwise"
    },
    Approved: { text: "Approved", color: "success", icon: "bi bi-check-lg" },
    Rejected: { text: "Rejected", color: "danger", icon: "bi bi-x" },
    Failed: { text: "Failed", color: "danger", icon: "bi bi-x" },
    Vetoed: { text: "Vetoed", color: "danger", icon: "bi bi-ban" },
    Executed: { text: "Executed", color: "info", icon: "bi bi-circle" }
};

return (
    <Container className="row p-0">
        <div id="main" className="col-lg-7 p-0">
            <div className="py-3 bg-dark d-flex justify-content-center">
                <h6>
                    <span className="text-secondary">NDC Governance | </span>
                    <span className="text-white">Interhouse relations</span>
                </h6>
            </div>
            <ImgContainer
                className={`w-100 d-flex flex-column justify-content-center align-items-center py-4 position-relative ${
                    state.vbWithTrust ? "px-1" : "px-5"
                }`}
            >
                {state.members.find((m) => m === context.accountId) && (
                    <Info className="mb-4 py-2 px-3 gap-2 d-flex justify-content-center align-items-center">
                        <UserIcon color={Content[state.selectedHouse].color}>
                            <img
                                width={11}
                                src="https://ipfs.near.social/ipfs/bafkreig7hd3ysbcb7dkvgzhaavltjvaw5pjtaqyj4qdbamwxhhh4yqp4su"
                            />
                        </UserIcon>
                        <small>
                            You are a member of
                            <b> {Content[state.selectedHouse].title}</b>
                        </small>
                    </Info>
                )}
                <Img
                    onClick={() =>
                        State.update({ vbWithTrust: !state.vbWithTrust })
                    }
                    src={
                        state.selectedHouse === "hom"
                            ? HOM_IMG
                            : state.selectedHouse === "coa"
                            ? COA_IMG
                            : state.selectedHouse === "tc"
                            ? TC_IMG
                            : state.selectedHouse === "vb"
                            ? state.vbWithTrust
                                ? VB_TRUST_IMG
                                : VB_IMG
                            : HOM_IMG
                    }
                />
            </ImgContainer>
        </div>

        <HousePanel className="shadow-sm col-lg-5">
            <ContentBlock
                title={Content[state.selectedHouse].title}
                description={Content[state.selectedHouse].description}
                abbr={state.selectedHouse}
                address={Content[state.selectedHouse].address}
                metadata={Content[state.selectedHouse].metadata}
            />
        </HousePanel>
    </Container>
);
