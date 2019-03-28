import React from "react";
import { StyleSheet, Platform, Animated, Dimensions } from "react-native";
import { AlertBaseProps } from "Types";
import Overlay from "../Overlay/Overlay";

const { width, height } = Dimensions.get("window");

type Props = AlertBaseProps;

type State = {
  animatedValue: Animated.Value;
};

class AlertBase extends React.Component<Props, State> {
  private overlayRef = React.createRef<Overlay>();

  state: State = {
    animatedValue: new Animated.Value(0)
  };

  show = (onShow?: () => void) => {
    if (this.overlayRef.current) {
      this.overlayRef.current.show(() => {
        if (this.props.animationType !== "none") {
          Animated.timing(this.state.animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            duration: 250
          }).start(onShow);
        }
      });
    }
  };

  hide = (onHide?: () => void) => {
    const { animationReverse = true, animationType } = this.props;
    if (animationType === "none") {
      this.overlayHide(onHide);
    } else {
      if (animationReverse) {
        Animated.timing(this.state.animatedValue, {
          toValue: 0,
          useNativeDriver: true,
          duration: 200
        }).start(() => this.overlayHide(onHide));
      } else {
        this.overlayHide(onHide);
      }
    }
  };

  private overlayHide = (onHide?: () => void) => {
    if (this.overlayRef.current) {
      this.overlayRef.current.hide(onHide);
    }
  };
  private getAnimationStyle() {
    const { animatedValue } = this.state;
    const { animationType } = this.props;

    let animationStyle = {};
    switch (animationType) {
      case "fade": {
        animationStyle = {
          opacity: animatedValue
        };
        break;
      }

      case "scale": {
        const scale = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.7, 1],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ scale }]
        };
        break;
      }

      case "slideFromLeft": {
        const translateX = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [-width, -width / 4, 0],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ translateX }]
        };
        break;
      }
      case "slideFromRight": {
        const translateX = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [width, width / 4, 0],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ translateX }]
        };
        break;
      }
      case "slideFromBottom": {
        const translateY = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [height, height / 4, 0],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ translateY }]
        };
        break;
      }
      case "slideFromTop": {
        const translateY = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [-height, -height / 4, 0],
          extrapolate: "clamp"
        });
        const opacity = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.7, 1],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity,
          transform: [{ translateY }]
        };
        break;
      }
      default:
        break;
    }

    return animationStyle;
  }

  render() {
    const { style, children, overlayAnimated, overlayDuration } = this.props;
    let animationStyle = this.getAnimationStyle();
    return (
      <Overlay
        ref={this.overlayRef}
        animated={overlayAnimated}
        duration={overlayDuration}
      >
        <Animated.View style={[styles.container, style, animationStyle]}>
          {children}
        </Animated.View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
      }
    }),
    borderRadius: 14,
    maxWidth: "90%"
  }
});

export default AlertBase;
