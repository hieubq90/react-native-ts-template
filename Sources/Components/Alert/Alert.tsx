import React from "react";
import { View, StyleSheet, Platform, Keyboard, Animated } from "react-native";
import { AlertProps } from "Types";
import Assets from "Assets";
import Text from "../Text/Text";
import Button from "../Button/Button";
import AlertBase from "./AlertBase";

type Props = AlertProps;

type State = {
  content: string;
  confirm: boolean;
  animatedValue: Animated.Value;
};

class Alert extends React.Component<Props, State> {
  private onClose?: () => void;
  private onOk?: () => void;
  private onCancel?: () => void;

  private alertBaseRef = React.createRef<AlertBase>();

  static defaultProps: Props = {
    positiveButtonText: "OK",
    negativeButtonText: "Cancel",
    animationReverse: true,
    animationType: "scale",
    overlayAnimated: true,
    overlayDuration: 200
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      content: "Are you sure?",
      confirm: false,
      animatedValue: new Animated.Value(0)
    };
  }

  show = (msg: string, onClose?: () => void) => {
    Keyboard.dismiss();
    this.setState({ content: msg, confirm: false }, () => {
      if (this.alertBaseRef.current) {
        this.alertBaseRef.current.show(() => {
          this.onClose = onClose;
        });
      }
    });
  };

  confirm = (msg: string, onOk?: () => void, onCancel?: () => void) => {
    Keyboard.dismiss();
    this.setState({ content: msg, confirm: true }, () => {
      if (this.alertBaseRef.current) {
        this.alertBaseRef.current.show(() => {
          this.onOk = onOk;
          this.onCancel = onCancel;
        });
      }
    });
  };

  private hide = (onHide?: () => void) => {
    if (this.alertBaseRef.current) {
      this.alertBaseRef.current.hide(onHide);
    }
  };

  private onOkPressed = () => {
    this.hide(() => {
      if (this.alertBaseRef.current) {
        this.alertBaseRef.current.hide(() => {
          if (this.state.confirm) {
            if (this.onOk) this.onOk();
          } else {
            if (this.onClose) this.onClose();
          }
        });
      }
    });
  };

  private onCancelPressed = () => {
    this.hide(() => {
      if (this.alertBaseRef.current) {
        this.alertBaseRef.current.hide(() => {
          if (this.onCancel) this.onCancel();
        });
      }
    });
  };

  render() {
    const { content, confirm } = this.state;
    const {
      positiveButtonText,
      positiveButtonStyle,
      negativeButtonStyle,
      negativeButtonText,
      overlayAnimated,
      overlayDuration,
      animationReverse,
      animationType
    } = this.props;

    const justifyContent = confirm ? "space-around" : "center";

    console.log({ overlayAnimated });
    return (
      <AlertBase
        ref={this.alertBaseRef}
        overlayAnimated={overlayAnimated}
        overlayDuration={overlayDuration}
        animationReverse={animationReverse}
        animationType={animationType}
      >
        <Text style={styles.content} text={content} />
        <View style={[styles.buttonContainer, { justifyContent }]}>
          <Button
            onPress={this.onOkPressed}
            style={[styles.okButton, positiveButtonStyle]}
            text={positiveButtonText}
            textStyle={styles.okButtonText}
          />
          {confirm && (
            <Button
              onPress={this.onCancelPressed}
              style={[styles.cancelButton, negativeButtonStyle]}
              text={negativeButtonText}
              textStyle={styles.cancelButtonText}
            />
          )}
        </View>
      </AlertBase>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
      }
    }),
    borderRadius: 14,
    maxWidth: "90%"
  },
  content: {
    marginTop: 16,
    marginHorizontal: 30,
    marginBottom: 37,
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    textAlign: "center",
    color: Assets.colors.slate
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  okButton: {
    marginHorizontal: 20,
    height: 46,
    width: 112,
    borderRadius: 23,
    padding: 0,
    backgroundColor: Assets.colors.primary
  },
  okButtonText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: "white",
    textAlign: "center"
  },
  cancelButton: {
    marginHorizontal: 20,
    height: 46,
    width: 112,
    borderRadius: 23,
    padding: 0,
    backgroundColor: Assets.colors.blueGrey
  },
  cancelButtonText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: "white"
  }
});

export default Alert;
