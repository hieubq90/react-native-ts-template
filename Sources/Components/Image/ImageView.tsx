import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { ImageViewProps } from "Types";

type Props = ImageViewProps;

const ImageView: React.SFC<Props> = props => {
  const { style, imageStyle, ...other } = props;
  return (
    <View style={[styles.container, style]}>
      <Image style={imageStyle} {...other} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
});

ImageView.defaultProps = {
  resizeMode: "contain"
};
export default ImageView;
