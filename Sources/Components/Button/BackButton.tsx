import React from "react";
import { Navigator } from "Navigation";
import { IconProps, Omit } from "Types";
import Assets from "Assets";
import LeftHeaderButton from "./LeftHeaderButton";

type Props = Omit<IconProps, "iconSource">;
const BackButton: React.SFC<Props> = props => {
  const onBack = () => Navigator.back();
  return (
    <LeftHeaderButton
      iconSource={Assets.images.back}
      onPress={onBack}
      {...props}
    />
  );
};
export default BackButton;
