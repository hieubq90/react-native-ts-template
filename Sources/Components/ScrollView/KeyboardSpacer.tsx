import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Keyboard,
  EventSubscription,
  LayoutAnimation,
  LayoutAnimationConfig,
  Dimensions
} from "react-native";
import { KeyboardSpacerProps } from "Types";
import { LayoutAnimations } from "Utils";

type Props = KeyboardSpacerProps;

type State = {
  keyboardSpace: number;
  isOpenned: boolean;
};

class KeyboardSpacer extends React.Component<Props, State> {
  private listeners: EventSubscription[] | null = null;
  static defaultProps: Props = {
    keyboardTopOffset: 0
  };
  constructor(props: Props) {
    super(props);

    this.state = { keyboardSpace: 0, isOpenned: false };
    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }
  componentDidMount() {
    LayoutAnimations.enableAndroidLayoutAnimation();
    const updateListener =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const resetListener =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
    this.listeners = [
      Keyboard.addListener(updateListener, this.updateKeyboardSpace),
      Keyboard.addListener(resetListener, this.resetKeyboardSpace)
    ];
  }

  componentWillUnmount() {
    if (this.listeners) this.listeners.forEach(listener => listener.remove());
  }

  private updateKeyboardSpace(event: any) {
    if (!event.endCoordinates || this.state.isOpenned) {
      return;
    }
    let animationConfig = LayoutAnimations.PresetEaseInOut;
    if (Platform.OS === "ios") {
      animationConfig = LayoutAnimations.Keyboard;
    }
    LayoutAnimations.setLayoutAnimation(animationConfig);

    const screenHeight = Dimensions.get("window").height;
    const { keyboardTopOffset, onShow } = this.props;
    const keyboardSpace =
      screenHeight - event.endCoordinates.screenY + keyboardTopOffset!;

    this.setState({ keyboardSpace, isOpenned: true }, () => {
      if (onShow) onShow(keyboardSpace);
    });
  }

  private resetKeyboardSpace(event: any) {
    if (!this.state.isOpenned) return;
    let animationConfig = LayoutAnimations.PresetEaseInOut;
    if (Platform.OS === "ios") {
      animationConfig = LayoutAnimations.Keyboard;
    }
    LayoutAnimations.setLayoutAnimation(animationConfig);
    this.setState({ keyboardSpace: 0, isOpenned: false }, () => {
      if (this.props.onHide) this.props.onHide();
    });
  }

  render() {
    const height = { height: this.state.keyboardSpace };
    const { style, ...other } = this.props;
    return <View style={[styles.container, height, style]} {...other} />;
  }
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default KeyboardSpacer;
