import React from "react";
import ImageView from "../Image/ImageView";
import Touchable from "../Touchable/Touchable";
import { IconProps } from "Types";

type Props = IconProps;
const Icon: React.SFC<Props> = props => {
  const {
    style,
    iconSource,
    iconStyle,
    onPress,
    hitSlop,
    iconContainerStyle,
    size = 22
  } = props;

  const containerStyle: any = {
    width: size * 2,
    height: size * 2,
    borderRadius: size,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  };
  return (
    <Touchable
      onPress={onPress}
      touchableStyle={[style, containerStyle]}
      hitSlop={hitSlop}
    >
      <ImageView
        style={iconContainerStyle}
        imageStyle={iconStyle}
        source={iconSource}
      />
    </Touchable>
  );
};

export default Icon;
