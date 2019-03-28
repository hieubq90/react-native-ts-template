import {
  TextProps as RNTextProps,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  ViewProps,
  TouchableNativeFeedbackProps,
  BackgroundPropType,
  TextStyle,
  ScrollViewProps as RNScrollViewProps,
  TextInputProps as RNTextInputProps,
  ModalProps as RNModalProps,
  StatusBarProps as RNStatusBarProps,
  ImageSourcePropType,
  ImageStyle,
  Animated,
  ImageProps,
  StyleSheet,
  ActivityIndicatorProps as RNActivityIndicatorProps,
  FlexAlignType,
  FlatListProps as RNFlatListProps
} from "react-native";
import {
  DrawerItemsProps as RNDrawerProps,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";
import { type } from "os";

export type Item<T> = {
  text: string;
  key: string;
  data?: T;
};

export type NavigationProps = NavigationScreenProp<NavigationState>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Point = {
  x: number;
  y: number;
};

export type AnimationType =
  | "slideFromLeft"
  | "slideFromRight"
  | "slideFromBottom"
  | "slideFromTop"
  | "fade"
  | "scale"
  | "none";

type TouchableExtrasProps = TouchableNativeFeedbackProps &
  TouchableOpacityProps;

export type TouchableProps = TouchableExtrasProps & {
  TouchableComponent?: React.ComponentClass<any>;
  ViewComponent?: React.ComponentClass<any>;
  touchableStyle?: StyleProp<ViewStyle>;
  linearProps?: {
    start?: Point;
    end?: Point;
    locations?: number[];
    colors?: string[];
  };
  boundedRipple?: boolean;
};

export type AlertBaseProps = ViewProps & {
  overlayAnimated?: boolean;
  overlayDuration?: number;
  animationType?: AnimationType;
  animationReverse?: boolean;
};
export type AlertProps = AlertBaseProps & {
  HeaderComponent?: () => JSX.Element;
  positiveButtonText?: string;
  positiveButtonStyle?: StyleProp<ViewStyle>;
  negativeButtonText?: string;
  negativeButtonStyle?: StyleProp<ViewStyle>;
};

export type ButtonProps = TouchableProps & {
  rasied?: boolean;
  text?: React.ReactText;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
};

export type CheckBoxProps = ViewProps & {
  checked?: boolean;
  onPress?: () => void;
  onStateChanged?: (checked: boolean) => void;
  activeTintColor?: string;
  activeImageSource?: ImageSourcePropType;
  activeImageStyle?: StyleProp<ImageStyle>;
  deactiveTintColor?: string;
  deactiveImageSource?: ImageSourcePropType;
  deactiveImageStyle?: StyleProp<ImageStyle>;
  text?: string;
  textPosition?: "left" | "right";
  activeTextStyle?: StyleProp<TextStyle>;
  deactiveTextStyle?: StyleProp<TextStyle>;
};

export type MenuCheckBoxProps = ViewProps & {
  children: React.ReactElement<CheckBoxProps>[];
  numCols?: number;
  multipleSelect?: boolean;
  initialSelectedIndex?: number;
  onItemSelected?: (index: number) => void;
  onItemsSelected?: (
    selectedItems: Array<{ index: number; checked: boolean }>
  ) => void;
};

export type TextProps = RNTextProps & {
  text?: React.ReactText;
};

export type ToastProps = ViewProps & {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  height?: number;
};

export type OverlayProps = ViewProps & {
  onPressOutside?: () => void;
  backgroundColor?: string;
  animated?: boolean;
  duration?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export type GridChildProps = RowProps | ColumnProps;
export type GridProps = ViewProps & {
  children: React.ReactNode[];
  numCols?: number;
  onPress?: () => void;
};

export type RowProps = ViewProps & {
  onPress?: () => void;
  flex?: number;
  children?: React.ReactElement<GridChildProps>[] | React.ReactNode;
  alignSelf?: "auto" | FlexAlignType;
  alignVertical?: FlexAlignType;
  alignHorizontal?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
};

export type ColumnProps = ViewProps & {
  onPress?: () => void;
  flex?: number;
  children?: React.ReactElement<GridChildProps>[] | React.ReactNode;
  alignSelf?: "auto" | FlexAlignType;
  alignHorizontal?: FlexAlignType;
  alignVertical?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
};

export type KeyboardSpacerProps = ViewProps & {
  onShow?: (spacer: number) => void;
  onHide?: () => void;
  keyboardTopOffset?: number;
};

export type ScrollViewProps = RNScrollViewProps & {
  keyboardTopOffset?: number;
};

type TextInputExtraProps = Omit<RNTextInputProps, "style"> & ViewProps;

export type TextInputValidateType =
  | "none"
  | "empty"
  | "length"
  | "email"
  | "phone"
  | "regex";

export type TextInputValidateForm = {
  type: TextInputValidateType;
  errorText: string;
};

export type TextInputProps = TextInputExtraProps & {
  underlineColor?: string;
  underlineWidth?: number;
  inputContainerStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperText?: string;
  helperStyle?: StyleProp<TextStyle>;
  LeftComponent?: React.ReactElement | React.FunctionComponent;
  RightComponent?: React.ReactElement | React.FunctionComponent;
  minLength?: number;
  validateTypes?: Array<TextInputValidateForm>;
  errorTextStyle?: StyleProp<TextStyle>;
  indicatorTextStyle?: StyleProp<TextStyle>;
  focusOnError?: boolean;
  onShouldReturn?: (text: string, error?: TextInputValidateType) => void;
  regex?: RegExp;
};

export type MaterialTextInputProps = TextInputProps & {
  activeColor?: string;
  placeholderDeactiveColor?: string;
};

type CodeInputExtraProps = Pick<
  RNTextInputProps,
  "returnKeyType" | "secureTextEntry" | "keyboardType"
>;
export type CodeInputProps = CodeInputExtraProps & {
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
  fontFamily?: string;
  activeBorderColor?: string;
  activeBorderWidth?: number;
  deactiveBorderColor?: string;
  deactiveBorderWidth?: number;
  numberInputs: number;
  spacing?: number;
  width?: number;
  height?: number;
  inputBorderRadius?: number;
  onTextChanged?: (text: string) => void;
};

export type IconProps = ViewProps & {
  size?: number;
  iconSource: ImageSourcePropType;
  iconContainerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
};

export type CardProps = ViewProps & {
  onPress?: () => void;
};

export type BottomSheetBaseProps = {
  height?: number;
  duration?: number;
  closeOnSwipeDown?: boolean;
  closeOnPressOutside?: boolean;
  bottomSheetStyle?: StyleProp<ViewStyle>;
};

export type ModalProps = OverlayProps & {
  closeOnBackAndroid?: boolean;
};

export type DropdownItem = Item<any>;
export type DropdownProps = ViewProps & {
  items: DropdownItem[];
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
  menuStyle?: StyleProp<ViewStyle>;
  menuItemStyle?: StyleProp<ViewStyle>;
  menuItemTextStyle?: StyleProp<TextStyle>;
  onItemSelected?: (item: DropdownItem, index: number) => void;
  initialText?: string;
};

export type StatusBarProps = RNStatusBarProps & {
  style?: StyleProp<ViewStyle>;
};

export type HeaderProps = ViewProps & {
  statusBarVisible?: boolean;
  statusBarProps?: StatusBarProps;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  LeftComponent?: React.ReactElement | React.FunctionComponent;
  leftContainerStyle?: StyleProp<ViewStyle>;
  RightComponent?: React.ReactElement | React.FunctionComponent;
  rightContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  headerStyle?: StyleProp<ViewStyle>;
};

export type InputGroupValidateForm = Array<{
  index: number;
  text: string;
  errorType: TextInputValidateType;
}>;

export type InputGroupProps = ViewProps & {
  onInputFocus?: (index: number) => void;
  onInputEndEditing?: (index: number) => void;
  onInputSubmit?: (validateForm?: InputGroupValidateForm) => void;
  spacing?: number;
};

export type SectionProps = ViewProps & {
  text: string;
  textStyle?: StyleProp<TextStyle>;
};

export type DrawerProps = RNDrawerProps & {
  drawerOpenProgress?: Animated.Value;
  overlayColor?: string;
  drawerType?: "front" | "back";
  useNativeAnimations?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export type DrawerHeaderProps = ViewProps & {
  imageContainerStyle?: ViewStyle;
  imageSource?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  drawerOpenProgress?: Animated.Value;
};

export type DrawerItemProps = ViewProps & {
  buttonStyle?: StyleProp<ViewStyle>;
  leftIconSource?: ImageSourcePropType;
  leftIconStyle?: StyleProp<ImageStyle>;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  rightIconSource?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  onPress?: () => void;
  hiddenDivider?: boolean;
};

type ImagePropsBase = Omit<ImageProps, "style">;
export type ImageViewProps = ImagePropsBase & {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export type ActivityIndicatorProps = {
  size?: "small" | "large" | number;
  style?: StyleProp<ViewStyle>;
  color?: string;
  ActivityComponent?: React.ComponentClass<any>;
};

export type SelectorItem = Item<any>;

export type SelectorProps = ViewProps & {
  initialIndex?: number;
  ItemComponent: (
    item: SelectorItem,
    index: number,
    length: number,
    selected: boolean
  ) => React.ReactElement<TouchableProps>;
  items: Array<SelectorItem>;
  onItemSelected?: (item: SelectorItem, index: number) => void;
};

export type ScrollableSelectorLayout = {
  width: number;
  height: number;
  itemWidth: number;
  itemHeight: number;
  length: number;
};

export type ScrollableSelectorProps = ViewProps & {
  numColumns?: number;
  horizontal?: boolean;
  scrollEnabled?: boolean;
  scrollOnSelected?: boolean;
  scrollOnSelectedPosition?: "center" | "left" | "right" | number;
  initialIndex?: number;
  ItemComponent: (
    item: SelectorItem,
    index: number,
    length: number,
    selected: boolean
  ) => React.ReactElement<TouchableProps>;
  items: Array<SelectorItem>;
  onItemSelected?: (item: SelectorItem, index: number) => void;
  onContentSizeChanged?: (layout: ScrollableSelectorLayout) => void;
};

type ImageViewExtraProps = Pick<
  ImageProps,
  "resizeMethod" | "resizeMode" | "source"
>;

export type AsyncImageProps = ImageViewExtraProps & {
  source?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export type UnderlineTabItem = Item<any>;

export type UnderlineTabsProps = ViewProps & {
  items: Array<UnderlineTabItem>;
  underlineStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeTextColor?: string;
  deactiveTextColor?: string;
  initialIndex?: number;
  onItemSelected?: (item: UnderlineTabItem, index: number) => void;
};

export type SolidTabItem = Item<any>;
export type SolidTabsProps = ViewProps & {
  items: Array<SolidTabItem>;
  textStyle?: StyleProp<TextStyle>;
  activeTextColor?: string;
  deactiveTextColor?: string;
  initialIndex?: number;
  solidStyle?: StyleProp<ViewStyle>;
  seperatorColor?: string;
  onItemSelected?: (item: SolidTabItem, index: number) => void;
};

type RNFlatListExtrasProps<ItemT> = Omit<
  RNFlatListProps<ItemT>,
  "renderItem" | "data" | "onRefresh"
>;
export type FlatListProps<ItemT> = RNFlatListExtrasProps<ItemT> & {
  onItemSelected?: (item: ItemT, index: number) => void;
  RenderItem: (item: ItemT, index: number) => JSX.Element;
  data: Array<ItemT>;
  onRefresh?: () => Promise<Array<ItemT>>;
  onLoadMore?: () => Promise<Array<ItemT>>;
};

export type BarProgressProps = ViewProps & {
  initialProgress?: number;
  height?: number;
  indeterminate?: boolean;
};

export type Linecap = "butt" | "square" | "round";

export type CircleProgressProps = {
  size: number;
  strokeLinecap?: Linecap;
  color?: string | Array<string>;
  strokeBgColor?: string;
  style?: StyleProp<ViewStyle>;
  thickness?: number;

  animating?: boolean;
  direction?: "cw" | "ccw";
  duration?: number;
  hidesWhenStopped?: boolean;
  spinDuration?: number;
  indeterminate?: boolean;
  percent?: number;
};
