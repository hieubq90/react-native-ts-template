import React from "react";
import { View, StyleSheet } from "react-native";
import { SelectorProps, SelectorItem } from "Types";

type Props = SelectorProps;

type State = {
  currentIndex: number;
};

type ItemParams = {
  item: SelectorItem;
  index: number;
};

class Selector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentIndex: props.initialIndex || 0
    };
  }

  private onItemSelected = ({ item, index }: ItemParams) => {
    if (this.state.currentIndex !== index) {
      const { onItemSelected } = this.props;
      this.setState({ currentIndex: index }, () => {
        if (onItemSelected) onItemSelected(item, index);
      });
    }
  };

  private renderItems = () => {
    const { ItemComponent, items } = this.props;
    if (Array.isArray(items) && items.length > 0) {
      const children = items.map((item, index) => {
        const selected = this.state.currentIndex === index;
        const onPress = () => this.onItemSelected({ item, index });

        if (typeof ItemComponent === "function") {
          const RenderItem = ItemComponent(item, index, items.length, selected);
          if (React.isValidElement(RenderItem)) {
            return React.cloneElement(RenderItem, {
              key: index,
              onPress: onPress,
              style: StyleSheet.flatten([RenderItem.props.style, { flex: 1 }])
            });
          }

          return null;
        }
      });

      return children;
    }

    return null;
  };

  render() {
    const { style } = this.props;
    return <View style={[styles.row, style]}>{this.renderItems()}</View>;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
export default Selector;
