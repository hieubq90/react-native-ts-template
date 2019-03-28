import React from "react";
import { View, StyleSheet, Animated, LayoutChangeEvent } from "react-native";
import { UnderlineTabsProps, UnderlineTabItem } from "Types";
import { Touchable } from "Components";
import Selector from "../Selector/Selector";
import Assets from "Assets";
import Text from "../Text/Text";

type State = {
  width: number;
  height: number;
  animatedValue: Animated.Value;
};

type Props = UnderlineTabsProps;

class UnderlineTabs extends React.Component<Props, State> {
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
    const length = this.props.items.length;
    const itemWidth = width / length;
    const inputRange = Array.from(Array(length).keys());
    const outputRange = inputRange.map(index => index * itemWidth);
    this.inputRange = inputRange;
    this.outputRange = outputRange;

    this.setState({ width, height });
  };

  private onItemSelected = (item: UnderlineTabItem, index: number) => {
    Animated.timing(this.state.animatedValue, {
      toValue: index,
      duration: 250,
      useNativeDriver: true
    }).start();
  };

  private renderItem = (
    item: UnderlineTabItem,
    index: number,
    length: number,
    selected: boolean
  ) => {
    const {
      textStyle,
      activeTextColor = Assets.colors.primary,
      deactiveTextColor = "black"
    } = this.props;
    const color = selected ? activeTextColor : deactiveTextColor;
    return (
      <Touchable touchableStyle={styles.center}>
        <Text style={[styles.text, textStyle, { color }]} text={item.text} />
      </Touchable>
    );
  };

  private renderUnderline = () => {
    const { width, animatedValue } = this.state;
    const { underlineStyle, items } = this.props;

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

    const style = StyleSheet.flatten([
      styles.underline,
      underlineStyle,
      { width: width / items.length }
    ]);
    return <Animated.View style={[style, animationStyle]} />;
  };

  render() {
    const { style, items, initialIndex = 0 } = this.props;
    return (
      <View style={style} onLayout={this.onLayout}>
        <Selector
          initialIndex={initialIndex}
          items={items}
          ItemComponent={this.renderItem}
          onItemSelected={this.onItemSelected}
        />
        {this.renderUnderline()}
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
    paddingHorizontal: 20
  },
  underline: {
    position: "absolute",
    height: 3,
    backgroundColor: Assets.colors.primary,
    left: 0,
    bottom: 0
  },
  center: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default UnderlineTabs;
