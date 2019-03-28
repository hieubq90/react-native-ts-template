import React from "react";
import {
  View,
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  Easing
} from "react-native";
import { BarProgressProps } from "Types";
import Assets from "Assets";

type Props = BarProgressProps;

type State = {
  width: number;
  height: number;
  progress: number;
  animatedTranslateX: Animated.Value;
};

class BarProgress extends React.Component<Props, State> {
  private textRef = React.createRef<Text>();

  constructor(props: Props) {
    super(props);
    const { initialProgress = 0 } = props;
    this.state = {
      width: -600,
      height: 0,
      progress: initialProgress,
      animatedTranslateX: new Animated.Value(0)
    };
  }

  componentDidMount() {
    if (this.props.indeterminate) {
      this.animate();
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.indeterminate !== this.props.indeterminate) {
      if (nextProps.indeterminate) {
        this.animate();
      }
    }
  }

  updateProgress(progress: number, aniamted: boolean = false) {
    this.updateText(progress);
    Animated.timing(this.state.animatedTranslateX, {
      toValue: progress,
      useNativeDriver: true,
      duration: aniamted ? 250 : 100
    }).start();
  }

  private animate() {
    this.state.animatedTranslateX.setValue(0);
    Animated.loop(
      Animated.timing(this.state.animatedTranslateX, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        isInteraction: false,
        useNativeDriver: true,
        delay: 250
      })
    ).start();
  }

  private updateText(progress: number) {
    if (this.textRef.current) {
      const percent = progress * 100;
      this.textRef.current.setNativeProps({ text: `${percent} %` });
    }
  }

  private renderTrack = () => {
    const { width, animatedTranslateX } = this.state;
    const { indeterminate } = this.props;
    const factor = indeterminate ? 0.35 : 1;
    const translateX = animatedTranslateX.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, indeterminate ? width : 0],
      extrapolate: "clamp"
    });

    const animationStyle = {
      transform: [{ translateX }]
    };

    return (
      <Animated.View
        style={[styles.track, animationStyle, { width: width * factor }]}
      >
        {this.renderText()}
      </Animated.View>
    );
  };

  private renderText = () => {
    <Text ref={this.textRef} style={styles.text}>
      {"0%"}
    </Text>;
  };

  private onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    this.setState({ width, height });
  };

  render() {
    const { style, height = 16 } = this.props;
    const containerStyle = {
      height,
      borderRadius: height / 2,
      ...styles.container
    };
    return (
      <View style={[containerStyle, style]} onLayout={this.onLayout}>
        {this.renderTrack()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: Assets.colors.primary,
    borderWidth: 2,
    overflow: "hidden"
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Assets.colors.primary
  },
  text: {
    fontSize: 12,
    fontFamily: Assets.font.avenir.medium,
    color: "white"
  }
});
export default BarProgress;
