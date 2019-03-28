import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { DrawerHeaderProps } from "Types";
import { Device } from "Utils";
import Assets from "Assets";

const statusBarHeight = Device.getStatusBarHeight(false) + 10;

type Props = DrawerHeaderProps;
class DrawerHeader extends React.Component<Props> {
  render() {
    const {
      style,
      imageContainerStyle,
      imageSource,
      imageStyle,
      drawerOpenProgress,
      children
    } = this.props;

    let animationStyle = {};
    if (drawerOpenProgress && imageSource) {
      const scale = drawerOpenProgress.interpolate({
        inputRange: [0, 0.4, 0.6, 0.8, 0.9, 1],
        outputRange: [0, 0.2, 0.4, 0.8, 1.1, 1],
        extrapolate: "clamp"
      });

      const opacity = drawerOpenProgress.interpolate({
        inputRange: [0, 0.4, 0.6, 0.8, 0.9, 1],
        outputRange: [0, 0.2, 0.7, 0.8, 0.9, 1],
        extrapolate: "clamp"
      });

      animationStyle = {
        opacity,
        transform: [{ scale }]
      };
    }

    return (
      <View style={[styles.container, style]}>
        {imageSource && (
          <View style={[styles.imageView, imageContainerStyle]}>
            <Animated.Image
              style={[styles.image, imageStyle, animationStyle]}
              source={imageSource}
              resizeMode="contain"
            />
          </View>
        )}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Assets.colors.primary,
    borderBottomWidth: 4
  },
  image: {
    width: "100%"
  },
  imageView: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: statusBarHeight,
    paddingHorizontal: 10
  },
  usename: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.heavy,
    color: Assets.colors.slate
  },
  text: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: Assets.font.avenir.roman,
    color: Assets.colors.slate
  }
});
export default DrawerHeader;
