import React from "react";
import { Modal as RNModal } from "react-native";
import { ModalProps } from "Types";
import Overlay from "../Overlay/Overlay";

type Props = ModalProps;
type State = { visible: boolean };
class Modal extends React.Component<Props, State> {
  private onHide?: () => void;
  private overlayRef = React.createRef<Overlay>();

  state: State = {
    visible: false
  };

  show = (onShow?: () => void) => {
    this.setState({ visible: true }, () => {
      if (this.overlayRef.current) {
        this.overlayRef.current.show(onShow);
      }
    });
  };

  hide = (onHide?: () => void) => {
    if (this.overlayRef.current) {
      this.onHide = onHide;
      this.overlayRef.current.hide(() => this.setState({ visible: false }));
    }
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state.visible !== nextState.visible;
  }

  private onRequestClose = () => {
    if (this.props.closeOnBackAndroid) {
      this.hide();
    }
  };

  render() {
    const { children, ...overlayProps } = this.props;

    return (
      <RNModal
        transparent
        visible={this.state.visible}
        animationType="none"
        onRequestClose={this.onRequestClose}
        onDismiss={this.onHide}
      >
        <Overlay ref={this.overlayRef} {...overlayProps}>
          {children}
        </Overlay>
      </RNModal>
    );
  }
}

export default Modal;
