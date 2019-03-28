import React from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInputProps,
  InputGroupProps,
  TextInputValidateType,
  InputGroupValidateForm
} from "Types";
import TextInput from "./TextInput";

type Props = InputGroupProps;
class InputGroup extends React.Component<Props> {
  private inputRefs: Array<TextInput> = [];
  private validateForm: InputGroupValidateForm = [];

  private onInputSubmmitEditing = (index: number) => {
    const length = this.inputRefs.length;
    console.log("submit index", index, length);
    if (index === length - 1) {
      if (this.props.onInputSubmit) {
        this.props.onInputSubmit();
      }
    } else {
      const textInput = this.inputRefs[index + 1];
      if (textInput) {
        textInput.focus();
        if (this.props.onInputFocus) {
          this.props.onInputFocus(index);
        }
      }
    }
  };

  private onShouldReturn = (
    index: number,
    text: string,
    error: TextInputValidateType
  ) => {
    const obj = {
      index,
      errorType: error,
      text
    };

    if (error === "none") {
      const items = this.validateForm.filter(item => item.index !== index);
      this.validateForm = items;

      if (items.length > 0) {
        const index = items[0].index;
        this.focus(index);
      } else {
        this.onInputSubmmitEditing(index);
      }
    } else {
      const validateIndex = this.validateForm.findIndex(
        item => item.index === index
      );
      if (validateIndex === -1) {
        this.validateForm.push(obj);
      }

      if (this.validateForm.length > 0) {
        const index = this.validateForm[0].index;
        this.focus(index);
      }
    }
  };

  clearText(atIndex: number) {
    const textInput = this.inputRefs[atIndex];
    if (textInput) {
      textInput.clearText();
    }
  }

  getText(atIndex: number): string | null {
    const textInput = this.inputRefs[atIndex];
    if (textInput) {
      return textInput.getText();
    }
    return null;
  }

  getAllText(): Array<string> {
    const texts = this.inputRefs.map(input => {
      if (input) {
        return input.getText();
      }
      return "";
    });
    return texts;
  }

  focus(atIndex: number) {
    const textInput = this.inputRefs[atIndex];
    if (textInput) {
      textInput.focus();
    }
  }

  render() {
    const { children, style, spacing } = this.props;
    let inputs = null;
    if (Array.isArray(children) && children.length > 0) {
      inputs = React.Children.map(children, (child, index) => {
        if (!React.isValidElement<TextInputProps>(child)) return null;
        const { style } = child.props;
        const marginTop =
          index === 0
            ? 0
            : (style && StyleSheet.flatten(style).marginTop) || spacing;
        const lastIndex = index === children.length - 1;
        const returnKeyType = child.props.returnKeyType
          ? child.props.returnKeyType
          : lastIndex
          ? "done"
          : "next";
        if (child.type === TextInput) {
          return React.cloneElement<TextInputProps>(child, {
            style: { marginTop },
            returnKeyType: returnKeyType,
            focusOnError: false,
            onSubmitEditing: () => this.onInputSubmmitEditing(index),
            //@ts-ignore
            ref: (node: any) => {
              if (node) this.inputRefs.push(node);
            }
          });
        }
        return React.cloneElement<TextInputProps>(child, {
          style: { marginTop },
          returnKeyType: returnKeyType,
          focusOnError: false,
          onShouldReturn: (text: string, error: TextInputValidateType) =>
            this.onShouldReturn(index, text, error),
          //@ts-ignore
          ref: (node: any) => {
            if (node) this.inputRefs.push(node);
          }
        });
      });
    } else {
      inputs = children;
    }

    return <View style={style}>{inputs}</View>;
  }
}

export default InputGroup;
