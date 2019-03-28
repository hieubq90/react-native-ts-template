import React from "react";
import { ButtonProps } from "Types";
import { StyleSheet, Platform } from "react-native";
import Assets from "Assets";
import Touchable from "../Touchable/Touchable";
import Text from "../Text/Text";

type Props = ButtonProps;
type State = {};

class Button extends React.Component<Props, State> {
  render() {
    const {
      style,
      buttonStyle,
      text,
      textStyle,
      children,
      disabled,
      rasied,
      ...other
    } = this.props;
    const backgroundColor =
      (style && StyleSheet.flatten(style).backgroundColor) ||
      styles.button.backgroundColor;

    return (
      <Touchable
        style={style}
        disabled={disabled}
        touchableStyle={[styles.button, { backgroundColor }, buttonStyle]}
        {...other}
      >
        {text && <Text text={text} style={textStyle} />}
        {children}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  rasied: {
    backgroundColor: "#fff",
    ...Platform.select({
      android: {
        elevation: 2
      },
      ios: {
        shadowColor: "rgba(0,0,0, .4)",
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1
      }
    })
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: Assets.colors.primary
  }
});
export default Button;
