import React from "react";
import { View, StyleSheet } from "react-native";
import { SectionProps } from "Types";
import Text from "../Text/Text";
import Assets from "Assets";

type Props = SectionProps;

const Section: React.SFC<Props> = props => {
  const { style, textStyle, text } = props;
  return (
    <View style={[styles.container, style]}>
      <Text text={text} style={[styles.text, textStyle]} />
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Assets.colors.primary,
    paddingVertical: 8,
    paddingLeft: 10
  },
  text: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "white"
  }
});
