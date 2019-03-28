import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ScrollableSelectorProps, SelectorItem } from "Types";

type Props = ScrollableSelectorProps;

type State = {
  currentIndex: number;
};

type ItemParams = {
  item: SelectorItem;
  index: number;
};

class ScrollableSelector extends React.Component<Props, State> {
  private flatlistRef = React.createRef<FlatList<SelectorItem>>();

  constructor(props: Props) {
    super(props);
    this.state = {
      currentIndex: props.initialIndex || 0
    };
  }

  private scrollToIndex = (at: number) => {
    const { scrollOnSelectedPosition, scrollOnSelected } = this.props;
    if (!scrollOnSelected) return;

    let viewPosition = 0.5;
    if (scrollOnSelectedPosition === "left") {
      viewPosition = 0;
    } else if (scrollOnSelectedPosition === "right") {
      viewPosition = 1;
    } else if (typeof scrollOnSelectedPosition === "number") {
      viewPosition = Math.min(1, Math.max(scrollOnSelectedPosition, 0));
    }

    if (this.flatlistRef.current) {
      this.flatlistRef.current.scrollToIndex({
        animated: true,
        index: at,
        viewPosition
      });
    }
  };

  private onItemSelected = ({ item, index }: ItemParams) => {
    if (this.state.currentIndex !== index) {
      const { onItemSelected } = this.props;
      this.setState({ currentIndex: index }, () => {
        this.scrollToIndex(index);
        if (onItemSelected) onItemSelected(item, index);
      });
    }
  };

  private renderItem = ({
    item,
    index
  }: {
    item: SelectorItem;
    index: number;
  }) => {
    const { ItemComponent, numColumns, items } = this.props;
    const selected = this.state.currentIndex === index;
    const onPress = () => this.onItemSelected({ item, index });

    if (typeof ItemComponent === "function") {
      const RenderItem = ItemComponent(item, index, items.length, selected);
      const flex = numColumns ? 1 / numColumns : 0;
      if (React.isValidElement(RenderItem)) {
        return React.cloneElement(RenderItem, {
          onPress: onPress,
          style: StyleSheet.flatten([RenderItem.props.style, { flex }])
        });
      }

      return null;
    }

    return null;
  };

  private keyExtractor = (item: SelectorItem, index: number) =>
    item.key || index.toString();

  render() {
    const {
      style,
      items = [],
      numColumns,
      horizontal,
      scrollEnabled = false,
      onLayout
    } = this.props;

    return (
      <View style={style} onLayout={onLayout}>
        <FlatList
          ref={this.flatlistRef}
          horizontal={horizontal}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          data={items}
          numColumns={numColumns}
          extraData={this.state.currentIndex}
          keyExtractor={this.keyExtractor}
          scrollEnabled={scrollEnabled}
        />
      </View>
    );
  }
}

export default ScrollableSelector;
