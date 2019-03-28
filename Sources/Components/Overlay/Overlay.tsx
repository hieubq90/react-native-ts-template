import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Animated
} from "react-native";
import { OverlayProps } from "Types";

type Props = OverlayProps;

type State = { visible: boolean; animatedOpacity: Animated.Value };

class Overlay extends React.Component<Props, State> {
  state: State = {
    visible: false,
    animatedOpacity: new Animated.Value(0)
  };

  show = (onShow?: () => void) => {
    const { animated, duration = 200 } = this.props;
    console.log("show", animated, duration);
    if (!animated) {
      this.state.animatedOpacity.setValue(1);
      this.setState({ visible: true }, onShow);
    } else {
      this.setState({ visible: true }, () => {
        Animated.timing(this.state.animatedOpacity, {
          toValue: 1,
          useNativeDriver: true,
          duration
        }).start(onShow);
      });
    }
  };

  hide = (onHide?: () => void) => {
    const { animated, duration = 200 } = this.props;
    if (!animated) {
      this.state.animatedOpacity.setValue(0);
      this.setState({ visible: false }, onHide);
    } else {
      Animated.timing(this.state.animatedOpacity, {
        toValue: 0,
        useNativeDriver: true,
        duration
      }).start(() => this.setState({ visible: false }, onHide));
    }
  };

  private onPressOutside = () => {
    const { onPressOutside } = this.props;
    if (onPressOutside) {
      this.hide(onPressOutside);
    }
  };

  render() {
    const { style, containerStyle, children, animated } = this.props;
    const { visible, animatedOpacity } = this.state;
    if (!visible) return null;
    let animationStyle = {};

    if (animated) {
      const opacity = animatedOpacity.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.7, 1],
        extrapolate: "clamp"
      });
      animationStyle = { opacity };
    }

    return (
      <TouchableWithoutFeedback onPress={this.onPressOutside}>
        <View style={styles.modal}>
          <Animated.View style={[styles.fill, style, animationStyle]}>
            <TouchableWithoutFeedback>
              <View style={[styles.container, containerStyle]}>{children}</View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      ios: { zIndex: 6 },
      android: { elevation: 6 }
    }),
    backgroundColor: "rgba(35,36,38,0.5)"
  },
  fill: {
    flex: 1,
    backgroundColor: "rgba(35,36,38,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  }
});

export default Overlay;
