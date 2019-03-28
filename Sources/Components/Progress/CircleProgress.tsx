import React from "react";
import Svg from "react-native-svg";
import Arc from "./../Shapes/Arc";
import { Animated, Easing } from "react-native";
import { CircleProgressProps } from "Types";

const AnimatedArc = Animated.createAnimatedComponent(Arc);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const MIN_ARC_ANGLE = 0.1;
const MAX_ARC_ANGLE = 1.5 * Math.PI;

type Props = CircleProgressProps;

type State = {
  startAngle: Animated.Value;
  endAngle: Animated.Value;
  rotation: Animated.Value;
  colorIndex: number;
  percent: number;
};

class CircleProgress extends React.Component<Props, State> {
  static propTypes = {};

  static defaultProps: Props = {
    animating: true,
    color: "rgba(0, 122, 255, 1)",
    direction: "cw",
    hidesWhenStopped: false,
    size: 40,
    thickness: 3,
    strokeLinecap: "butt",
    strokeBgColor: "rgba(0,0,0,0.2)"
  };

  constructor(props: Props) {
    super(props);
    const { indeterminate, percent = 0.5 } = props;
    const startAngle = indeterminate ? -MIN_ARC_ANGLE : 0;
    this.state = {
      startAngle: new Animated.Value(startAngle),
      endAngle: new Animated.Value(0),
      rotation: new Animated.Value(0),
      colorIndex: 0,
      percent
    };
  }

  updateProgress = (percent: number) => {
    this.state.endAngle.setValue(percent * Math.PI * 2);
  };

  componentDidMount() {
    if (this.props.animating && this.props.indeterminate) {
      this.animate();
      this.spin();
    }
  }

  componentWillReceiveProps(props: Props) {
    if (props.animating !== this.props.animating && props.indeterminate) {
      if (props.animating) {
        this.animate();
        this.spin();
      } else {
        this.stopAnimations();
      }
      if (props.percent !== undefined && props.percent !== this.props.percent) {
        this.updateProgress(props.percent);
      }
    }
  }

  animate(iteration = 1) {
    Animated.sequence([
      Animated.timing(this.state.startAngle, {
        toValue: -MAX_ARC_ANGLE * iteration - MIN_ARC_ANGLE,
        duration: this.props.duration || 1000,
        isInteraction: false,
        easing: Easing.inOut(Easing.quad)
      }),
      Animated.timing(this.state.endAngle, {
        toValue: -MAX_ARC_ANGLE * iteration,
        duration: this.props.duration || 1000,
        isInteraction: false,
        easing: Easing.inOut(Easing.quad)
      })
    ]).start(endState => {
      if (endState.finished) {
        if (Array.isArray(this.props.color)) {
          this.setState({
            colorIndex: iteration % this.props.color.length
          });
        }
        this.animate(iteration + 1);
      }
    });
  }

  spin() {
    Animated.loop(
      Animated.timing(this.state.rotation, {
        toValue: 1,
        duration: this.props.spinDuration || 5000,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true
      })
    ).start();
  }

  stopAnimations() {
    this.state.startAngle.stopAnimation();
    this.state.endAngle.stopAnimation();
    this.state.rotation.stopAnimation();
  }

  render() {
    const {
      animating,
      color,
      direction,
      hidesWhenStopped,
      size,
      style,
      thickness = 4,
      strokeLinecap,
      strokeBgColor,
      indeterminate = false
    } = this.props;

    if (!animating && hidesWhenStopped) {
      return null;
    }

    const { rotation, colorIndex, startAngle, endAngle } = this.state;

    const radius = size / 2 - thickness;
    const offset = {
      top: thickness,
      left: thickness
    };

    const directionFactor = direction === "cw" ? 1 : -1;

    const rotate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", `${directionFactor * 360}deg`]
    });

    const containerStyle = {
      transform: [{ rotate }]
    };

    const strokeColor = Array.isArray(color)
      ? indeterminate
        ? color[colorIndex]
        : color[0]
      : color;

    if (indeterminate) {
      return (
        <AnimatedSvg width={size} height={size} style={[style, containerStyle]}>
          <AnimatedArc
            direction={direction === "ccw" ? "cw" : "ccw"}
            radius={radius}
            strokeColor={strokeColor}
            offset={offset}
            startAngle={startAngle}
            endAngle={endAngle}
            strokeLinecap={strokeLinecap}
            strokeWidth={thickness}
          />
        </AnimatedSvg>
      );
    }

    const angle = this.state.percent * Math.PI * 2;
    return (
      <Svg width={size} height={size} style={style}>
        <AnimatedArc
          direction="cw"
          radius={radius}
          strokeColor={strokeColor}
          startAngle={0}
          endAngle={angle}
          strokeLinecap={strokeLinecap}
          strokeWidth={thickness}
        />
        <Arc
          direction="cw"
          radius={radius}
          strokeColor={strokeBgColor}
          startAngle={0}
          endAngle={Math.PI * 2}
          strokeLinecap={strokeLinecap}
          strokeWidth={thickness}
        />
      </Svg>
    );
  }
}

export default CircleProgress;
