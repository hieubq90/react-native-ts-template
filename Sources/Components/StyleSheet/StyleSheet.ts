import {
  StyleSheet as RNStyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  RegisteredStyle,
  Dimensions,
  StyleProp
} from "react-native";

const { width, height } = Dimensions.get("window");
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const _baseWidth = 375;
const _baseHeight = 812;
const hs = shortDimension / _baseWidth;
const vs = longDimension / _baseHeight;

type Style = Partial<ViewStyle | TextStyle | ImageStyle>;
type StyleObject = { [className: string]: StyleProp<Style> };
type NamedStyles<T> = { [P in keyof T]: StyleProp<Style> };

function create<T extends NamedStyles<T>>(styles: T | StyleObject): T {
  // @ts-ignore: Unreachable code error
  return RNStyleSheet.create<T>(styles);
}

function flatten<T>(style?: RegisteredStyle<T>): T {
  return RNStyleSheet.flatten(style);
}

const absoluteFill = RNStyleSheet.absoluteFill;
const absoluteFillObject = RNStyleSheet.absoluteFillObject;
const hairlineWidth = RNStyleSheet.hairlineWidth;

export default {
  create,
  flatten,
  absoluteFill,
  absoluteFillObject,
  hairlineWidth,
  vs,
  hs
};
