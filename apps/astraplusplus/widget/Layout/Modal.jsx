const toggle = props.toggle ?? <button role="none">Open Modal</button>;
const toggleContainerProps = props.toggleContainerProps ?? {};
const content = props.content ?? (
  <div className="p-5 bg-white">Modal Content</div>
);
const open = props.open;
const onOpenChange = props.onOpenChange;
const modalWidth = props.modalWidth ?? "700px";
const avoidDefaultDomBehavior = props.avoidDefaultDomBehavior;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 99999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
`;

const Content = styled.div`
  max-width: ${modalWidth};
  max-height: 100%;
  overflow-y: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  outline: none !important;
`;

const NoButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`;

const avoidDefaultBehavior = (e) => {
  avoidDefaultDomBehavior && e.preventDefault();
};

return (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>
      <NoButton {...toggleContainerProps}>{toggle}</NoButton>
    </Dialog.Trigger>
    <Dialog.Overlay asChild>
      <Overlay>
        <Dialog.Content
          asChild
          onPointerDownOutside={avoidDefaultBehavior}
          onInteractOutside={avoidDefaultBehavior}
        >
          <Content>
            <div
              className={
                avoidDefaultDomBehavior && "ndc-card position-relative"
              }
            >
              {avoidDefaultDomBehavior && (
                <div
                  className="position-absolute"
                  style={{ right: 15, top: 10 }}
                >
                  <Dialog.Close asChild>
                    <i class="bi bi-x-lg"></i>
                  </Dialog.Close>
                </div>
              )}
              {content}
            </div>
          </Content>
        </Dialog.Content>
      </Overlay>
    </Dialog.Overlay>
  </Dialog.Root>
);
