import React from "react";
import Assets from "Assets";
import { ImageBackground, StyleSheet } from "react-native";

const SplashScreen: React.SFC = props => {
  return (
    <ImageBackground
      source={Assets.images.splashScreen}
      style={StyleSheet.absoluteFill}
    >
      {props.children}
    </ImageBackground>
  );
};

export default SplashScreen;
