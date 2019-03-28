import React from "react";
import { HeaderProps } from "Types";
import { View, ViewStyle, TextStyle } from "react-native";
import { Device } from "Utils";
import StatusBar from "../StatusBar/StatusBar";
import Text from "../Text/Text";
import HamburgerButton from "../Button/HamburgerButton";
import Assets from "Assets";

type Props = HeaderProps;
const headerHeight = Device.getHeaderHeight();
const Header: React.SFC<Props> = props => {
  const {
    style,
    headerStyle,
    title,
    statusBarProps,
    statusBarVisible,
    LeftComponent,
    RightComponent,
    backgroundColor,
    titleContainerStyle,
    titleStyle,
    leftContainerStyle,
    rightContainerStyle,
    children
  } = props;

  const defaultStyle: ViewStyle = {
    backgroundColor,
    height: headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  };
  const textStyle: TextStyle = {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: "white"
  };

  const titleContainer: ViewStyle = {
    flex: 3,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  };

  const buttonCornor: ViewStyle = {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center"
  };

  const renderLeftComponent = () => {
    if (LeftComponent && React.isValidElement(LeftComponent))
      return LeftComponent;

    if (LeftComponent && typeof LeftComponent === "function") {
      const c: Function = LeftComponent;
      return c();
    }
    return null;
  };

  const renderRightComponent = () => {
    if (RightComponent && React.isValidElement(RightComponent))
      return RightComponent;

    if (RightComponent && typeof RightComponent === "function") {
      const c: Function = RightComponent;
      return c();
    }
    return null;
  };

  return (
    <View style={style}>
      {statusBarVisible && <StatusBar {...statusBarProps} />}
      <View style={[defaultStyle, headerStyle]}>
        <View style={[buttonCornor, { paddingLeft: 8 }, leftContainerStyle]}>
          {renderLeftComponent()}
        </View>
        <View style={[titleContainer, titleContainerStyle]}>
          <Text style={[textStyle, titleStyle]} text={title} />
        </View>
        <View style={[buttonCornor, { paddingRight: 5 }, rightContainerStyle]}>
          {renderRightComponent()}
        </View>
      </View>
      {children}
    </View>
  );
};

Header.defaultProps = {
  statusBarVisible: true,
  statusBarProps: {
    translucent: true,
    backgroundColor: "rgba(0,0,0,0.2)",
    barStyle: "light-content",
    style: { backgroundColor: Assets.colors.primary }
  },
  backgroundColor: Assets.colors.primary,
  LeftComponent: <HamburgerButton />
};

export default Header;
