import React from "react";
import { View, StyleSheet, FlexStyle } from "react-native";
import { ColumnProps } from "Types";
import Touchable from "../Touchable/Touchable";

const Column: React.SFC<ColumnProps> = props => {
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
    justifyContent: alignVertical,
    alignItems: alignHorizontal,
    alignSelf: alignSelf,
    flexDirection: "column",
    flex: flex ? flex : style && StyleSheet.flatten(style).width ? 0 : 0
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

export default Column;
