import React from "react";
import { Text as RNText, StyleSheet } from "react-native";
import { TextProps } from "Types";
import Assets from "Assets";

type Props = TextProps;
const Text: React.SFC<Props> = props => {
  const { text, children, style } = props;
  const c = children || text;
  return <RNText style={[styles.text, style]}>{c}</RNText>;
};

Text.defaultProps = {
  text: "Custom Text"
};

Text.displayName = "Custom Text";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "white"
  }
});

export default Text;
