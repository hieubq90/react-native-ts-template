import React from "react";
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputFocusEventData
} from "react-native";
import { CodeInputProps } from "Types";
import TextInput from "../Input/TextInput";

type Props = CodeInputProps;
type State = {
  lastIndex: number;
  currentIndex: number;
  texts: string[];
};

class CodeInput extends React.Component<Props, State> {
  private inputRefs: TextInput[] = [];

  constructor(props: Props) {
    super(props);
    const { numberInputs } = props;
    this.state = {
      texts: new Array(numberInputs).fill(""),
      lastIndex: 0,
      currentIndex: -1
    };
  }

  static defaultProps: Props = {
    numberInputs: 4,
    spacing: 10,
    width: 50,
    height: 50,
    inputBorderRadius: 4,
    activeBorderColor: "blue",
    activeBorderWidth: 2,
    deactiveBorderColor: "black",
    deactiveBorderWidth: 1,
    fontSize: 20,
    secureTextEntry: true
  };

  focusInput(atIndex: number) {
    const input = this.inputRefs[atIndex];
    if (input) input.focus();
  }

  getText = () => {
    return this.state.texts.toString();
  };

  clearText = () => {
    if (this.inputRefs.length < 1) return;
    this.setState({ texts: [] }, () => {
      this.inputRefs.forEach(input => input.clearText());
    });
  };

  private onTextChange = (index: number, text: string) => {
    const { numberInputs, onTextChanged } = this.props;
    let texts = this.state.texts;
    texts[index] = text;
    if (text !== "") {
      if (index == numberInputs - 1) {
      } else {
        const nextInputRef = this.inputRefs[index + 1];
        if (nextInputRef) nextInputRef.focus();
      }
    }

    this.setState({ texts }, () => {
      const text = texts.join("");
      if (onTextChanged) onTextChanged(text);
    });
  };

  private onBackSpacePress = (index: number) => {
    if (index > 0) {
      const currentText = this.state.texts[index];
      if (currentText === "") {
        const nextInputRef = this.inputRefs[index - 1];
        if (nextInputRef) nextInputRef.focus();
      }
    }
  };

  private onFocus = (index: number) => {
    this.setState({ currentIndex: index });
  };

  private renderInputs = () => {
    const {
      numberInputs,
      returnKeyType,
      secureTextEntry,
      fontFamily,
      fontSize,
      spacing,
      width,
      height,
      activeBorderColor,
      activeBorderWidth,
      deactiveBorderColor,
      deactiveBorderWidth,
      inputBorderRadius,
      keyboardType
    } = this.props;

    const { currentIndex } = this.state;
    const inputStyle = {
      fontFamily,
      fontSize,
      width: width,
      height: height,
      textAlign: "center"
    };
    const inputs = Array.apply(null, Array(numberInputs)).map((_, index) => {
      const containerInputStyle = {
        marginHorizontal: spacing! / 2,
        borderColor:
          index === currentIndex ? activeBorderColor : deactiveBorderColor,
        borderWidth:
          index === currentIndex ? activeBorderWidth : deactiveBorderWidth,
        borderRadius: inputBorderRadius
      };

      const id = `input${index}`;

      const onChangeText = (text: string) => {
        this.onTextChange(index, text);
      };

      const onKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>
      ) => {
        if (e.nativeEvent.key === "Backspace") {
          this.onBackSpacePress(index);
        }
      };

      const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        this.onFocus(index);
      };

      return (
        <TextInput
          key={id}
          ref={r => {
            if (r) this.inputRefs[index] = r;
          }}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={1}
          inputStyle={StyleSheet.flatten([inputStyle, containerInputStyle])}
          onChangeText={onChangeText}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          underlineColor="transparent"
        />
      );
    });
    return inputs;
  };
  render() {
    const { style } = this.props;
    return <View style={[styles.container, style]}>{this.renderInputs()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  }
});
export default CodeInput;
