import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  ViewStyle
} from "react-native";
import { UnderlineTabItem, SolidTabsProps, SolidTabItem } from "Types";
import { Touchable } from "Components";
import Selector from "../Selector/Selector";
import Assets from "Assets";
import Text from "../Text/Text";

type State = {
  width: number;
  height: number;
  animatedValue: Animated.Value;
};

type Props = SolidTabsProps;

class SolidTabs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { initialIndex = 0 } = props;
    this.state = {
      width: 0,
      height: 0,
      animatedValue: new Animated.Value(initialIndex)
    };
  }

  private inputRange: number[] = [];
  private outputRange: number[] = [];

  private onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const { style, items } = this.props;
    const length = items.length;
    const borderWidth =
      (style && StyleSheet.flatten(style).borderRadius) ||
      styles.container.borderWidth;
    const itemWidth = (width - borderWidth * 2) / length;
    const inputRange = Array.from(Array(length).keys());
    const outputRange = inputRange.map(index => index * itemWidth);
    this.inputRange = inputRange;
    this.outputRange = outputRange;

    this.setState({ width, height });
  };

  private onItemSelected = (item: SolidTabItem, index: number) => {
    Animated.timing(this.state.animatedValue, {
      toValue: index,
      duration: 250,
      useNativeDriver: true
    }).start();
  };

  private renderItem = (
    item: SolidTabItem,
    index: number,
    length: number,
    selected: boolean
  ) => {
    const {
      textStyle,
      seperatorColor = Assets.colors.primary,
      activeTextColor = "white",
      deactiveTextColor = "black"
    } = this.props;
    const color = selected ? activeTextColor : deactiveTextColor;
    let defaultStyle = {};
    if (index !== 0) {
      defaultStyle = {
        borderLeftWidth: 1,
        borderLeftColor: seperatorColor
      };
    }

    return (
      <Touchable style={defaultStyle} touchableStyle={styles.center}>
        <Text style={[styles.text, textStyle, { color }]} text={item.text} />
      </Touchable>
    );
  };

  private renderSolid = () => {
    const { width, animatedValue, height } = this.state;
    const { items, solidStyle, style } = this.props;

    let animationStyle = {};

    if (width !== 0) {
      const translateX = animatedValue.interpolate({
        inputRange: this.inputRange,
        outputRange: this.outputRange
      });
      animationStyle = {
        transform: [{ translateX }]
      };
    }

    const defaultStyle = StyleSheet.flatten([
      styles.solid,
      solidStyle,
      { width: width / items.length }
    ]);

    return <Animated.View style={[defaultStyle, animationStyle]} />;
  };

  render() {
    const { style, items, initialIndex = 0 } = this.props;
    return (
      <View style={[styles.container, style]} onLayout={this.onLayout}>
        {this.renderSolid()}
        <Selector
          initialIndex={initialIndex}
          items={items}
          ItemComponent={this.renderItem}
          onItemSelected={this.onItemSelected}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  container: {
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 20,
    marginHorizontal: 20,
    overflow: "hidden"
  },
  solid: {
    position: "absolute",
    backgroundColor: Assets.colors.primary,
    left: 0,
    bottom: 0,
    top: 0
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default SolidTabs;
