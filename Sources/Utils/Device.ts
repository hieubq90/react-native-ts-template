import { Dimensions, Platform, StatusBar } from "react-native";

const _isAndroid = Platform.OS == "android";
const _version = Platform.Version;
const { width, height } = Dimensions.get("window");

function isAndroid(): boolean {
  return _isAndroid;
}

function version(): string | number {
  return _version;
}

function getScreenSize(): { width: number; height: number } {
  return { width, height };
}

function isIphoneX() {
  return (
    Platform.OS === "ios" &&
    (height === 812 || width === 812 || (height === 896 || width === 896))
  );
}

function ifIphoneX(iphoneXStyle: number, regularStyle: number) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

function getStatusBarHeight(safe?: boolean) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight
  });
}

function getHeaderHeight() {
  const headerHeight = Platform.OS == "android" ? 56 : 44;
  return headerHeight;
}

export default {
  getScreenSize,
  isAndroid,
  version,
  getStatusBarHeight,
  getHeaderHeight,
  width,
  height
};
