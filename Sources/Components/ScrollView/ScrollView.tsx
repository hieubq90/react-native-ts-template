import React from "react";
import { ScrollView as RNScrollView, LayoutChangeEvent } from "react-native";
import { ScrollViewProps } from "Types";
import KeyboardSpacer from "./KeyboardSpacer";

type Props = ScrollViewProps;

type State = {
  scrollEnable: boolean;
};

export default class ScrollView extends React.Component<Props, State> {
  private contentHeight: number = 0;
  private height: number = 0;

  static defaultProps: Props = {
    keyboardTopOffset: 10
  };

  constructor(props: Props) {
    super(props);
    this.state = { scrollEnable: false };
  }

  private onContentSizeChange = (w: number, h: number) => {
    this.contentHeight = h;
    if (this.height !== 0) {
      this.updateScrollViewEnable();
    }
  };

  private onLayout = (event: LayoutChangeEvent) => {
    this.height = event.nativeEvent.layout.height;
    if (this.contentHeight != 0) {
      this.updateScrollViewEnable();
    }
  };

  private updateScrollViewEnable = () => {
    const scrollEnable = this.contentHeight > this.height;
    if (this.state.scrollEnable != scrollEnable) {
      this.setState({ scrollEnable });
    }
  };

  render() {
    const { scrollEnable } = this.state;
    const { keyboardTopOffset, ...other } = this.props;
    return (
      <RNScrollView
        {...other}
        scrollEnabled={scrollEnable}
        onContentSizeChange={this.onContentSizeChange}
        onLayout={this.onLayout}
        automaticallyAdjustContentInsets={false}
      >
        {this.props.children}
        <KeyboardSpacer keyboardTopOffset={keyboardTopOffset} />
      </RNScrollView>
    );
  }
}
