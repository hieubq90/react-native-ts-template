import React from "react";
import { Navigator } from "Navigation";
import { IconProps, Omit } from "Types";
import Assets from "Assets";
import LeftHeaderButton from "./LeftHeaderButton";

type Props = Omit<IconProps, "iconSource">;
const HamburgerButton: React.SFC<Props> = props => {
  const onToggleDrawer = () => Navigator.toggleDrawer();
  return (
    <LeftHeaderButton
      onPress={onToggleDrawer}
      iconSource={Assets.images.hamburger}
      {...props}
    />
  );
};
export default HamburgerButton;
