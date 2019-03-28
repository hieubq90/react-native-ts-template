import React from "react";
import { IconProps } from "Types";
import Icon from "../Icon/Icon";
import Assets from "Assets";

type Props = IconProps;
const RightHeaderButton: React.SFC<Props> = props => {
  return (
    <Icon
      iconSource={props.iconSource}
      hitSlop={{ left: 20, right: 10, top: 5, bottom: 5 }}
      style={{ alignSelf: "flex-end", marginRight: 0 }}
      {...props}
    />
  );
};

RightHeaderButton.defaultProps = {
  iconSource: Assets.images.back
};
export default RightHeaderButton;
