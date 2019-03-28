import React from "react";
import {
  FlatList as RNFlatList,
  StyleSheet,
  Platform,
  Animated,
  View,
  GestureResponderEvent
} from "react-native";
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
  scrollY: Animated.Value;
  state: "PullToRefresh" | "ReadyToRefresh" | "Refreshing" | "Refreshed";
};

class PtrFlatList<ItemT> extends React.Component<Props<ItemT>, State<ItemT>> {
  private flatlistRef = React.createRef<any>();

  constructor(props: Props<ItemT>) {
    super(props);
    const { data } = props;
    this.state = {
      data,
      refreshing: false,
      canLoadMore: false,
      scrollY: new Animated.Value(0),
      state: "PullToRefresh"
    };
  }

  componentDidMount() {
    this.state.scrollY.addListener(value => this.handleScroll(value));
  }
  componentWillUnmount() {
    this.state.scrollY.removeAllListeners();
  }

  private handleScroll(state: { value: number }) {
    const { value } = state;
    console.log("handle scroll", value);
    if (value <= -130 && this.state.state === "PullToRefresh") {
      this.setState({ state: "ReadyToRefresh" });
    }
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

  private scrollTo(y: number, animated: boolean = true) {
    if (this.flatlistRef.current) {
      console.log(
        "this.flatlistRef.current",
        this.flatlistRef.current._component
      );
      this.flatlistRef.current._component.scrollToOffset({
        offset: y,
        animated
      });
    }
  }

  private onResponderRelease = (event: GestureResponderEvent) => {
    if (this.state.state === "ReadyToRefresh") {
      this.setState({ state: "Refreshing" });
      this.scrollTo(-130);
      setTimeout(() => {
        this.scrollTo(0);
        this.setState({ state: "PullToRefresh" });
      }, 2000);
    }
    // return this.setState({ state: "None" });
  };

  render() {
    const { refreshing, data, scrollY } = this.state;

    const {
      style,
      contentContainerStyle,
      ListEmptyComponent = this.ListEmptyComponent
    } = this.props;

    const onScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: true }
    );

    const translateY = scrollY.interpolate({
      inputRange: [-130, 0],
      outputRange: [130, 0]
    });

    const animationStyle = {
      transform: [{ translateY }]
    };
    return (
      <View style={[styles.container, style]}>
        <Animated.View style={[styles.ptr]}>
          <Text text={this.state.state} />
        </Animated.View>
        <Animated.FlatList
          ref={this.flatlistRef}
          style={[style, animationStyle]}
          contentContainerStyle={contentContainerStyle}
          ListEmptyComponent={ListEmptyComponent}
          data={data}
          renderItem={this.renderItem}
          //   refreshing={refreshing}
          onScroll={onScroll}
          //   onEndReached={this.onEndReached}
          //   onEndReachedThreshold={onEndReachedThreshold}
          //   onRefresh={this.onRefresh}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onResponderRelease={this.onResponderRelease}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "black"
  },
  topBar: {
    backgroundColor: "#F7F7F8",
    height: 64
  },
  navText: {
    color: "#A4C8D9",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 30
  },
  ptr: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default PtrFlatList;
