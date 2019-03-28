import React from "react";
import { View, StyleSheet, FlexStyle } from "react-native";
import { RowProps } from "Types";
import { Touchable } from "Components";

const Row: React.SFC<RowProps> = props => {
  const {
    children,
    flex,
    style,
    alignHorizontal,
    alignVertical,
    alignSelf,
    onPress
  } = props;
  const flexStyle: FlexStyle = {
    alignItems: alignVertical,
    justifyContent: alignHorizontal,
    alignSelf: alignSelf,
    flexDirection: "row",
    flex: flex ? flex : style && StyleSheet.flatten(style).height ? 0 : 0
  };

  if (onPress && typeof onPress === "function") {
    return (
      <Touchable style={style} onPress={onPress}>
        <View style={flexStyle}>{children}</View>
      </Touchable>
    );
  }

  return <View style={[style, flexStyle]}>{children}</View>;
};

export default Row;
