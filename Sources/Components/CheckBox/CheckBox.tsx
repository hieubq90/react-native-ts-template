import React from "react";
import { StyleSheet } from "react-native";
import { CheckBoxProps } from "Types";
import Assets from "Assets";
import Icon from "../Icon/Icon";
import Row from "../Layout/Row";
import Text from "../Text/Text";

type Props = CheckBoxProps;

type State = {
  checked: boolean;
};

class CheckBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { checked = false } = props;
    this.state = {
      checked
    };
  }

  static defaultProps: Props = {
    textPosition: "right"
  };

  toggle = (onDidToggle?: (checked: boolean) => void) => {
    const { checked } = this.state;
    const newState = !checked;
    this.setState({ checked: newState }, () => {
      if (this.props.onStateChanged) {
        this.props.onStateChanged(newState);
      }
      if (onDidToggle) {
        onDidToggle(newState);
      }
    });
  };

  private onPress = () => {
    const { onPress } = this.props;
    if (onPress) {
      onPress();
    } else {
      this.toggle();
    }
  };

  private renderTextLeft = () => {
    const { textPosition, text } = this.props;
    if (textPosition !== "left" || text === undefined) return null;
    const { deactiveTextStyle, activeTextStyle } = this.props;
    const checked = this.state.checked;
    const style = checked ? activeTextStyle : deactiveTextStyle;

    return <Text style={[styles.text, style]} text={text} />;
  };

  private renderTextRight = () => {
    const { textPosition, text } = this.props;
    if (textPosition !== "right" || text === undefined) return null;
    const { deactiveTextStyle, activeTextStyle } = this.props;
    const checked = this.state.checked;
    const style = checked ? activeTextStyle : deactiveTextStyle;

    return <Text style={[styles.text, style]} text={text} />;
  };

  render() {
    const { checked } = this.state;
    const {
      style,
      activeTintColor = Assets.colors.danger,
      activeImageSource = Assets.images.checkBoxChecked,
      activeImageStyle,
      deactiveTintColor = Assets.colors.danger,
      deactiveImageSource = Assets.images.checkBoxUncheck,
      deactiveImageStyle,
      hitSlop = { top: 10, left: 10, right: 10, bottom: 10 }
    } = this.props;
    const source = checked ? activeImageSource : deactiveImageSource;
    const tintColor = checked ? activeTintColor : deactiveTintColor;
    const iconStyle = checked ? activeImageStyle : deactiveImageStyle;

    return (
      <Row alignVertical="center" style={style}>
        {this.renderTextLeft()}
        <Icon
          hitSlop={hitSlop}
          onPress={this.onPress}
          style={styles.container}
          iconSource={source}
          iconStyle={[iconStyle, { tintColor }]}
        />
        {this.renderTextRight()}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "black"
  }
});

export default CheckBox;
