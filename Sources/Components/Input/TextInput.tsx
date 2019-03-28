import React from "react";
import {
  View,
  TextInput as RNTextInput,
  Platform,
  StyleSheet,
  GestureResponderEvent
} from "react-native";
import { TextInputProps } from "Types";
import Text from "../Text/Text";
import Assets from "Assets";

type Props = TextInputProps;

type State = {
  text: string;
};

class TextInput extends React.Component<Props, State> {
  private textInputRef = React.createRef<RNTextInput>();

  constructor(props: Props) {
    super(props);
    this.state = {
      text: props.defaultValue || ""
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

  private onTextChanged = (text: string) => {
    this.setState({ text }, () => {
      if (this.props.onChangeText) {
        this.props.onChangeText(text);
      }
    });
  };

  private renderLeftComponent = () => {
    const { LeftComponent } = this.props;
    if (LeftComponent && React.isValidElement(LeftComponent))
      return LeftComponent;

    if (LeftComponent && typeof LeftComponent === "function") {
      const c: Function = LeftComponent;
      return c();
    }
    return null;
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

  render() {
    const {
      style,
      inputStyle,
      helperText,
      helperStyle,
      underlineColor,
      underlineWidth,
      returnKeyLabel,
      returnKeyType,
      defaultValue,
      placeholder,
      placeholderTextColor,
      keyboardType,
      secureTextEntry,
      multiline,
      maxLength,
      onSubmitEditing,
      onKeyPress,
      onFocus,
      editable,
      numberOfLines,
      scrollEnabled,
      autoCapitalize,
      inputContainerStyle
    } = this.props;

    const hiddenUnderline = multiline || underlineWidth == 0;
    const underlineStyle = hiddenUnderline
      ? {}
      : {
          borderBottomColor: underlineWidth
            ? underlineColor || "black"
            : undefined,
          borderBottomWidth: underlineWidth || StyleSheet.hairlineWidth
        };

    const defaultStyle: any = {
      paddingBottom: 4,
      fontSize: 16,
      flex: 1,
      fontFamily: Assets.font.avenir.roman,
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

    return (
      <View
        style={[style, underlineStyle]}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
      >
        {helperText && <Text text={helperText} style={helperStyle} />}
        <View style={inputContainer}>
          {this.renderLeftComponent()}
          <RNTextInput
            ref={this.textInputRef}
            style={[defaultStyle, inputStyle]}
            returnKeyLabel={returnKeyLabel}
            returnKeyType={returnKeyType}
            defaultValue={defaultValue}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            maxLength={maxLength}
            onChangeText={this.onTextChanged}
            onSubmitEditing={onSubmitEditing}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            underlineColorAndroid="transparent"
            autoCapitalize={autoCapitalize || "none"}
            autoCorrect={false}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            scrollEnabled={scrollEnabled}
          />
          {this.renderRightComponent()}
        </View>
      </View>
    );
  }
}

export default TextInput;
