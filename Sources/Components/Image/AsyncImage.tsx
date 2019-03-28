import React from "React";
import {
  Image,
  View,
  StyleSheet,
  ImageURISource,
  Animated,
  ImageLoadEventData,
  NativeSyntheticEvent
} from "react-native";

import { AsyncImageProps } from "Types";
import Assets from "Assets";
import ActivityIndicator from "../ActivityIndicator/ActivityIndicator";

type Props = AsyncImageProps;
type State = {
  width: number;
  height: number;
  loading: boolean;
};

class AsyncImage extends React.Component<Props, State> {
  private animatedValue = new Animated.Value(0);
  constructor(props: Props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      loading: true
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.source) {
      const { uri = undefined, width, height } = props.source as ImageURISource;
      if (!uri) return null;
      if (width && height) {
        return { width, height, loading: false };
      }
      Image.getSize(
        uri,
        (width, height) => {
          return { width, height, loading: false };
        },
        error => {
          return { loading: false };
        }
      );

      return {
        loading: true
      };
    }

    return null;
  }

  onLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { width, height } = event.nativeEvent.source;
    this.setState({ width, height, loading: false }, () => {
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      }).start();
    });
  };

  render() {
    const { width, height, loading } = this.state;
    if (width == 0 || height == 0) return null;
    const { style, source } = this.props;
    const animationStyle = {
      opacity: this.animatedValue
    };
    return (
      <View style={[styles.container, style]}>
        <Animated.Image
          onLoad={this.onLoad}
          style={[styles.image, animationStyle]}
          source={source}
          resizeMode="contain"
        />
        {loading && <ActivityIndicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: Assets.colors.lightBlueGrey,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "100%"
  }
});
export default AsyncImage;
