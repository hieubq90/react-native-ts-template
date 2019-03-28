import React from "react";
import { FlatList as RNFlatList, StyleSheet, Platform } from "react-native";
import { FlatListProps } from "Types";
import Text from "../Text/Text";
import Assets from "Assets";
import Touchable from "../Touchable/Touchable";

const onEndReachedThreshold = Platform.OS == "ios" ? 0 : 0.01;

type Props<ItemT> = FlatListProps<ItemT>;

type State<ItemT> = {
  refreshing: boolean;
  data: Array<ItemT>;
  canLoadMore: boolean;
};

class FlatList<ItemT> extends React.Component<Props<ItemT>, State<ItemT>> {
  constructor(props: Props<ItemT>) {
    super(props);
    const { data } = props;
    this.state = {
      data,
      refreshing: false,
      canLoadMore: false
    };
  }

  private ListEmptyComponent = (
    <Text style={styles.emptyText} text="--- No data to display ----" />
  );

  private renderItem = ({ item, index }: { item: ItemT; index: number }) => {
    const { onItemSelected, RenderItem } = this.props;
    const Item = RenderItem(item, index);
    if (onItemSelected) {
      return <Touchable>{Item}</Touchable>;
    }

    return Item;
  };

  private onRefresh = () => {
    const { onRefresh } = this.props;
    if (onRefresh) {
      console.log("onrefresh");
      this.setState({ refreshing: true });
      onRefresh()
        .then(newData => {
          console.log("new data", newData);
          this.setState({
            canLoadMore: false,
            refreshing: false,
            data: newData
          });
        })
        .catch(error => {
          console.warn("onRefresh Error: ", error);
          this.setState({
            canLoadMore: false,
            refreshing: false,
            data: []
          });
        });
    }
  };

  private onMomentumScrollBegin = () => this.setState({ canLoadMore: true });

  private onEndReached = (info: { distanceFromEnd: number }) => {
    console.log("info", info, this.state.canLoadMore);
    const { onLoadMore } = this.props;
    if (onLoadMore && this.state.canLoadMore) {
      this.setState({ refreshing: true });
      onLoadMore()
        .then(newData => {
          this.setState({
            refreshing: false,
            data: newData,
            canLoadMore: false
          });
        })
        .catch(error => {
          this.setState({
            refreshing: false,
            data: [],
            canLoadMore: false
          });
          console.warn("onRefresh Error: ", error);
        });
    }
  };

  render() {
    const { refreshing, data } = this.state;

    const {
      style,
      contentContainerStyle,
      ListEmptyComponent = this.ListEmptyComponent,
      ListHeaderComponent,
      ListFooterComponent
    } = this.props;
    return (
      <RNFlatList
        style={style}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        data={data}
        renderItem={this.renderItem}
        refreshing={refreshing}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onRefresh={this.onRefresh}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
      />
    );
  }
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "black"
  }
});

export default FlatList;
