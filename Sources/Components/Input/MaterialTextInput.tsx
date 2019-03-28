import React from "react";
import {
  View,
  TextInput as RNTextInput,
  Platform,
  StyleSheet,
  GestureResponderEvent,
  Animated
} from "react-native";
import { TextInputValidateType, MaterialTextInputProps } from "Types";
import { Validator } from "Utils";
import Text from "../Text/Text";
import Assets from "Assets";

type Props = MaterialTextInputProps;

type State = {
  text: string;
  shuoldChangeColor?: boolean;
  animatedTextTransform: Animated.Value;
  animatedUnderline: Animated.Value;
  animatedErrorText: Animated.Value;
  currentErrorState: TextInputValidateType;
  currentErrorMessage: string;
};

class MaterialTextInput extends React.Component<Props, State> {
  private textInputRef = React.createRef<RNTextInput>();

  static defaultProps: Props = {
    validateTypes: [
      { type: "empty", errorText: "This field shuold not be empty" }
    ]
  };

  constructor(props: Props) {
    super(props);
    console.log("props.minLength", props.minLength);
    this.state = {
      text: props.defaultValue || "",
      animatedTextTransform: new Animated.Value(1),
      animatedErrorText: new Animated.Value(0),
      animatedUnderline: new Animated.Value(0),
      shuoldChangeColor: false,
      currentErrorState: "none",
      currentErrorMessage: ""
    };
  }

  setNativeProps = (props: object) => {
    if (this.textInputRef.current) {
      this.textInputRef.current.setNativeProps(props);
    }
  };

  focus = () => {
    if (this.textInputRef.current) {
      if (!this.textInputRef.current.isFocused()) {
        this.textInputRef.current.focus();
      }
    }
  };

  clearText = () => {
    this.setState({ text: "" }, () => {
      if (this.textInputRef.current) this.textInputRef.current.clear();
    });
  };

  getText = () => {
    return this.state.text;
  };

  private renderRightComponent = () => {
    const { RightComponent } = this.props;
    if (RightComponent && React.isValidElement(RightComponent))
      return RightComponent;

    if (RightComponent && typeof RightComponent === "function") {
      const c: Function = RightComponent;
      return c();
    }
    return null;
  };

  private onStartShouldSetResponder = (e: GestureResponderEvent) => {
    this.focus();
    return true;
  };

  private onTextChanged = (text: string) => {
    this.setState({ text }, () => {
      if (this.props.onChangeText) {
        this.props.onChangeText(text);
      }
      if (this.state.currentErrorState !== "none") {
        this.setState({ currentErrorState: "none" }, () => {
          Animated.timing(this.state.animatedErrorText, {
            toValue: 0,
            duration: 250
          }).start();
        });
      }
    });
  };

  private setError(text: string, errorType: TextInputValidateType) {
    const { focusOnError, onShouldReturn, validateTypes } = this.props;
    if (Array.isArray(validateTypes) && validateTypes.length > 0) {
      const item = validateTypes.find(item => item.type === errorType);
      if (item) {
        const currentErrorMessage = item.errorText;
        this.setState(
          { currentErrorState: errorType, currentErrorMessage },
          () => {
            Animated.timing(this.state.animatedErrorText, {
              toValue: 1,
              duration: 250
            }).start(() => {
              if (onShouldReturn) onShouldReturn(text, errorType);
              if (focusOnError) this.focus();
            });
          }
        );
      }
    }
  }

  private onFocus = () => {
    const { text, currentErrorState } = this.state;
    if (text === "") {
      if (currentErrorState === "none") {
        Animated.parallel([
          Animated.timing(this.state.animatedTextTransform, {
            toValue: 0,
            duration: 250
          }),
          Animated.timing(this.state.animatedUnderline, {
            toValue: 1,
            duration: 250
          }),
          Animated.timing(this.state.animatedErrorText, {
            toValue: 0,
            duration: 250
          })
        ]).start();
      }
    } else {
      Animated.timing(this.state.animatedUnderline, {
        toValue: 1,
        duration: 250
      }).start();
    }
  };

  private onBlur = () => {
    const { text } = this.state;
    const { minLength, validateTypes, onShouldReturn } = this.props;
    if (text === "") {
      this.setError(text, "empty");
    } else {
      if (minLength && text.length < minLength) {
        this.setError(text, "length");
      } else {
        if (Array.isArray(validateTypes) && validateTypes.length > 0) {
          const { regex } = this.props;
          let item = validateTypes.find(item => item.type === "email");
          if (item) {
            let isEmail = false;
            if (regex) {
              isEmail = regex.test(text);
            } else {
              isEmail = Validator.isEmail(text);
            }
            if (!isEmail) {
              this.setError(text, "email");
              return;
            }
          }

          item = validateTypes.find(item => item.type === "phone");
          if (item) {
            let isPhone = false;
            if (regex) {
              isPhone = regex.test(text);
            } else {
              isPhone = Validator.isPhoneNumber(text);
            }
            if (!isPhone) {
              this.setError(text, "phone");
              return;
            }
          }

          item = validateTypes.find(item => item.type === "regex");
          if (item && regex) {
            const isValid = regex.test(text);
            if (!isValid) {
              this.setError(text, "regex");
              return;
            }
          }

          Animated.parallel([
            Animated.timing(this.state.animatedUnderline, {
              toValue: 0,
              duration: 250
            }),
            Animated.timing(this.state.animatedErrorText, {
              toValue: 0,
              duration: 250
            })
          ]).start(() => {
            if (onShouldReturn) onShouldReturn(text, "none");
          });
        }
      }
    }
  };

  private getHelperTextAnimation() {
    const { animatedTextTransform, animatedUnderline } = this.state;
    const {
      placeholderDeactiveColor = "black",
      activeColor = Assets.colors.primary
    } = this.props;

    const height = 40;

    const translateY = animatedTextTransform.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height / 2]
    });

    const translateX = animatedTextTransform.interpolate({
      inputRange: [0, 1],
      outputRange: [-height / 2 - 4, 4]
    });

    const scale = animatedTextTransform.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1]
    });

    const color = animatedUnderline.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        placeholderDeactiveColor,
        placeholderDeactiveColor,
        activeColor
      ]
    });
    const animationStyle = {
      color,
      transform: [{ translateY }, { translateX }, { scale: scale }]
    };
    return animationStyle;
  }

  private getUnderlineAnimationStyle() {
    const { animatedUnderline } = this.state;
    const {
      underlineColor = "black",
      underlineWidth = StyleSheet.hairlineWidth,
      activeColor = Assets.colors.primary
    } = this.props;
    const width = animatedUnderline.interpolate({
      inputRange: [0, 1],
      outputRange: [underlineWidth, 2 * underlineWidth]
    });

    const color = animatedUnderline.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [underlineColor, activeColor, activeColor]
    });

    const animationStyle = {
      borderBottomColor: color,
      borderBottomWidth: width
    };
    return animationStyle;
  }

  private getErrorTextAnimation() {
    const { animatedErrorText } = this.state;
    const opacity = animatedErrorText.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 0, 1]
    });
    const scale = animatedErrorText.interpolate({
      inputRange: [0, 0.8, 0.9, 1],
      outputRange: [0, 1, 1.1, 1]
    });

    const animationStyle = {
      opacity,
      transform: [{ scale }]
    };

    return animationStyle;
  }

  render() {
    const {
      style,
      inputStyle,
      helperStyle,
      placeholder,
      underlineColor,
      underlineWidth,
      returnKeyLabel,
      returnKeyType,
      defaultValue,
      placeholderTextColor,
      keyboardType,
      secureTextEntry,
      multiline,
      onSubmitEditing,
      onKeyPress,
      editable,
      numberOfLines,
      scrollEnabled,
      autoCapitalize,
      inputContainerStyle,
      indicatorTextStyle,
      errorTextStyle,
      maxLength
    } = this.props;

    const hiddenUnderline = multiline || underlineWidth == 0;
    let underlineStyle = {};
    if (!hiddenUnderline) {
      underlineStyle = {
        borderBottomColor: underlineWidth
          ? underlineColor || "black"
          : undefined,
        borderBottomWidth: underlineWidth || StyleSheet.hairlineWidth
      };
    }

    const defaultStyle: any = {
      ...Platform.select({
        android: {
          paddingVertical: 0,
          textAlignVertical: multiline ? "top" : "auto"
        }
      })
    };

    const inputContainer: any = [
      { flexDirection: "row", alignItems: "center" },
      inputContainerStyle
    ];

    let valueTextLength = "";
    if (maxLength) {
      const length = this.state.text.length;
      valueTextLength = `${length} / ${maxLength}`;
    }

    const textAnimationStyle = this.getHelperTextAnimation();
    const underlineAnimationStyle = this.getUnderlineAnimationStyle();
    const errorTextAnimationStyle = this.getErrorTextAnimation();

    return (
      <View
        style={[style]}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
      >
        <Animated.Text style={[helperStyle, textAnimationStyle]}>
          {placeholder}
        </Animated.Text>
        <Animated.View
          style={[inputContainer, underlineStyle, underlineAnimationStyle]}
        >
          <RNTextInput
            ref={this.textInputRef}
            style={[styles.input, defaultStyle, inputStyle]}
            returnKeyLabel={returnKeyLabel}
            returnKeyType={returnKeyType}
            defaultValue={defaultValue}
            placeholder=""
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            onChangeText={this.onTextChanged}
            onSubmitEditing={onSubmitEditing}
            onKeyPress={onKeyPress}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            underlineColorAndroid="transparent"
            autoCapitalize={autoCapitalize || "none"}
            autoCorrect={false}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            scrollEnabled={scrollEnabled}
          />
          {this.renderRightComponent()}
        </Animated.View>
        <View style={styles.row}>
          <Animated.Text
            style={[styles.error, errorTextStyle, errorTextAnimationStyle]}
          >
            {this.state.currentErrorMessage}
          </Animated.Text>
          {maxLength && (
            <Text
              text={valueTextLength}
              style={[styles.indicator, indicatorTextStyle]}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    paddingBottom: 4,
    paddingLeft: 4,
    flex: 1,
    fontSize: 16,
    color: "black",
    fontFamily: Assets.font.avenir.roman
  },
  indicator: {
    fontSize: 14,
    color: "black",
    fontFamily: Assets.font.avenir.roman
  },
  error: {
    fontSize: 14,
    color: "#ff0000",
    fontFamily: Assets.font.avenir.roman
  }
});
export default MaterialTextInput;
