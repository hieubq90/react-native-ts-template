import React from "react";
import { TouchableProps } from "Types";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback
} from "react-native";
import Assets from "Assets";

const isAndroid = Platform.OS === "android";
type Props = TouchableProps;
type State = {};

class Touchable extends React.Component<Props, State> {
  static defaultProps: Props = {
    TouchableComponent: isAndroid ? TouchableNativeFeedback : TouchableOpacity,
    activeOpacity: 0.5,
    linearProps: {
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
      colors: [Assets.colors.primaryDark, Assets.colors.primary],
      locations: [0, 1]
    }
  };
  render() {
    const {
      style,
      touchableStyle,
      TouchableComponent = TouchableOpacity,
      ViewComponent = View,
      linearProps,
      children,
      onLayout,
      boundedRipple = false,
      ...other
    } = this.props;

    const hasBorder =
      (touchableStyle && StyleSheet.flatten(touchableStyle).borderRadius) ||
      (style && StyleSheet.flatten(style).borderRadius);
    const borderRadius =
      (touchableStyle && StyleSheet.flatten(touchableStyle).borderRadius) ||
      (style && StyleSheet.flatten(style).borderRadius) ||
      0;

    if (isAndroid && hasBorder && !other.background) {
      if (Platform.Version >= 21) {
        other.background = TouchableNativeFeedback.Ripple(
          "ThemeAttrAndroid",
          !boundedRipple
        );
      } else {
        other.background = TouchableNativeFeedback.SelectableBackground();
      }
    }

    const linearGradientProps = ViewComponent === View ? {} : linearProps;

    const { activeOpacity, background, onPress, disabled, hitSlop } = other;

    const isFixedDimension =
      style &&
      StyleSheet.flatten(style).width &&
      StyleSheet.flatten(style).height;

    const fixedStyle = isFixedDimension ? styles.full : { padding: 0 };

    const touchableStyles = StyleSheet.flatten([
      styles.button,
      { borderRadius },
      fixedStyle,
      touchableStyle
    ]);

    return (
      <View
        style={[styles.container, style, { borderRadius }]}
        onLayout={onLayout}
        hitSlop={hitSlop}
      >
        <TouchableComponent
          activeOpacity={activeOpacity}
          background={background}
          onPress={onPress}
          disabled={disabled}
          hitSlop={hitSlop}
        >
          <ViewComponent {...linearGradientProps} style={touchableStyles}>
            {children}
          </ViewComponent>
        </TouchableComponent>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent"
  },
  button: {
    backgroundColor: "transparent"
  },
  full: {
    width: "100%",
    height: "100%"
  }
});
export default Touchable;
