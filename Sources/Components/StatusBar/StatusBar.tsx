import React from "react";
import { StatusBar as RNStatusBar, View, Platform } from "react-native";
import { StatusBarProps } from "Types";
import { Device } from "Utils";
import Assets from "Assets";

type Props = StatusBarProps;
const statusBarHeight = Device.getStatusBarHeight(true);

const StatusBar: React.SFC<Props> = props => {
  if (Platform.OS == "ios") {
    const {
      style,
      barStyle,
      networkActivityIndicatorVisible,
      showHideTransition,
      backgroundColor,
      animated
    } = props;
    const height = statusBarHeight;
    return (
      <View style={[{ backgroundColor, height }, style]}>
        <RNStatusBar
          animated={animated}
          barStyle={barStyle}
          networkActivityIndicatorVisible={networkActivityIndicatorVisible}
          showHideTransition={showHideTransition}
        />
      </View>
    );
  }

  const { barStyle, translucent, backgroundColor, animated, style } = props;
  const height = statusBarHeight;
  if (translucent) {
    return (
      <View style={[{ height }, style]}>
        <RNStatusBar
          translucent={true}
          barStyle={barStyle}
          backgroundColor={backgroundColor}
          animated={animated}
        />
      </View>
    );
  }

  return (
    <RNStatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      animated={animated}
    />
  );
};

StatusBar.defaultProps = {
  translucent: true,
  backgroundColor: Assets.colors.primary,
  barStyle: "light-content",
  animated: true
};

export default StatusBar;
