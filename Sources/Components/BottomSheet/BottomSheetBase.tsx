import React from "react";
import {
  Animated,
  PanResponder,
  PanResponderInstance,
  Dimensions
} from "react-native";
import { BottomSheetBaseProps } from "Types";
import Modal from "../Modal/Modal";

const { height } = Dimensions.get("window");
const windowHeight = height;

type Props = BottomSheetBaseProps;
type State = {
  animatedHeight: Animated.Value;
  animatedPan: Animated.ValueXY;
};
class BottomSheetBase extends React.Component<Props, State> {
  private panResponder?: PanResponderInstance;
  private modalRef = React.createRef<Modal>();

  static defaultProps: Props = {
    height: 260,
    closeOnPressOutside: true,
    closeOnSwipeDown: true,
    duration: 250
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      animatedHeight: new Animated.Value(0),
      animatedPan: new Animated.ValueXY()
    };
    this.createPanResponder();
  }

  private createPanResponder() {
    const { closeOnSwipeDown, height } = this.props;
    const { animatedPan } = this.state;
    const dy = animatedPan.y;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => closeOnSwipeDown!,
      onPanResponderMove: (e, gestureState) => {
        gestureState.dy < 0
          ? null
          : Animated.event([null, { dy }])(e, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (height! / 4 - gestureState.dy < 0) {
          this.hide();
        } else {
          Animated.spring(animatedPan, {
            toValue: { x: 0, y: 0 }
          }).start();
        }
      }
    });
  }

  show = () => {
    if (this.modalRef.current) {
      const { duration = 400 } = this.props;
      this.modalRef.current.show(() => {
        Animated.timing(this.state.animatedHeight, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true
        }).start();
      });
    }
  };

  hide = (onClose?: () => void) => {
    const { duration = 400 } = this.props;
    const { animatedHeight, animatedPan } = this.state;
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true
    }).start(() => {
      animatedPan.setValue({ x: 0, y: 0 });
      if (this.modalRef.current) this.modalRef.current.hide(onClose);
    });
  };

  private onPressOutSide = () => {
    if (this.props.closeOnPressOutside) {
      this.hide();
    }
  };

  render() {
    const { animatedHeight, animatedPan } = this.state;

    const {
      children,
      bottomSheetStyle,
      height,
      duration = 200,
      closeOnPressOutside
    } = this.props;
    const panStyle = {
      transform: animatedPan.getTranslateTransform()
    };

    const opacity = animatedHeight.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1],
      extrapolate: "clamp"
    });

    const translateY = animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [windowHeight, 0],
      extrapolate: "clamp"
    });

    const animationStyle = {
      opacity,
      transform: [{ translateY }]
    };
    return (
      <Modal
        ref={this.modalRef}
        style={{ justifyContent: "flex-end" }}
        containerStyle={{ maxWidth: "100%", width: "100%" }}
        onPressOutside={this.onPressOutSide}
        duration={duration}
        animated
      >
        <Animated.View
          {...this.panResponder!.panHandlers}
          style={[
            { height, width: "100%", backgroundColor: "white" },
            panStyle,
            bottomSheetStyle,
            animationStyle
          ]}
        >
          {children}
        </Animated.View>
      </Modal>
    );
  }
}

export default BottomSheetBase;
