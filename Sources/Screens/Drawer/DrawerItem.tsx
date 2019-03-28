import React from "react";
import { DrawerItemProps } from "Types";
import { Button, Text } from "Components";
import { View, Image, StyleSheet } from "react-native";
import Assets from "Assets";

type Props = DrawerItemProps;
const DrawerItem: React.SFC<Props> = props => {
  const {
    style,
    leftIconSource,
    leftIconStyle,
    text,
    textStyle,
    rightIconSource,
    rightIconStyle,
    hiddenDivider,
    buttonStyle,
    onPress
  } = props;

  const dividerStyle = hiddenDivider
    ? {}
    : {
        borderBottomWidth: 1,
        borderBottomColor: "white"
      };
  return (
    <View style={style}>
      <Button
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.container, dividerStyle]}
        buttonStyle={[styles.button, buttonStyle]}
      >
        <View style={styles.row}>
          {leftIconSource && (
            <Image
              source={leftIconSource}
              style={[styles.icon, leftIconStyle]}
              resizeMode="contain"
            />
          )}
          <Text text={text} style={[styles.text, textStyle]} />
        </View>
        <View style={{ marginRight: 10 }}>
          {rightIconSource && (
            <Image
              source={rightIconSource}
              style={[styles.rightIcon, rightIconStyle]}
            />
          )}
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    padding: 0,
    backgroundColor: "transparent",
    borderRadius: 0,
    paddingVertical: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    marginLeft: 10,
    paddingVertical: 6,
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.primary
  },
  rightIcon: {
    // tintColor: "white"
  },
  icon: {
    maxWidth: 17
  }
});

export default DrawerItem;
