import React from "react";
import { Navigator } from "Navigation";
import { IconProps, Omit } from "Types";
import Icon from "../Icon/Icon";
import Assets from "Assets";

type Props = IconProps;
const LeftHeaderButton: React.SFC<Props> = props => {
  return (
    <Icon
      iconSource={props.iconSource}
      hitSlop={{ left: 10, right: 20, top: 5, bottom: 5 }}
      style={{ alignItems: "flex-start", paddingLeft: 0 }}
      {...props}
    />
  );
};

LeftHeaderButton.defaultProps = {
  iconStyle: Assets.images.back
};

export default LeftHeaderButton;
