import React from "react";
import { ActivityIndicator as RNActivityIndicator } from "react-native";
import { ActivityIndicatorProps } from "Types";
import Assets from "Assets";

type Props = ActivityIndicatorProps;

const ActivityIndicator: React.SFC<Props> = props => {
  const { style, color, size, ActivityComponent = RNActivityIndicator } = props;
  const isNativeIndicator = ActivityComponent === RNActivityIndicator;

  const validSize: any =
    typeof size === "number" && size >= 36 ? "large" : "small";

  const nativeProps = {
    style,
    size: validSize,
    color,
    animating: true,
    hidesWhenStopped: true
  };

  const customProps = {
    style,
    size: size === "large" ? 36 : size === "small" ? 20 : size,
    indeterminate: true,
    thickness: 3,
    color
  };
  const validProps = isNativeIndicator ? nativeProps : customProps;
  return <ActivityComponent {...validProps} />;
};

ActivityIndicator.defaultProps = {
  size: 50,
  color: Assets.colors.primary
};

export default ActivityIndicator;
