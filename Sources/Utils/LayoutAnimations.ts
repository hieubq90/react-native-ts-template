import {
  LayoutAnimation,
  Platform,
  UIManager,
  LayoutAnimationConfig
} from "react-native";

function enableAndroidLayoutAnimation() {
  if (Platform.OS == "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Keyboard: LayoutAnimationConfig = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut
  }
};

const Toast: LayoutAnimationConfig = {
  duration: 250,
  create: {
    delay: 500,
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity
  }
};

const ListItem: LayoutAnimationConfig = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 0.7
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  }
};

function setLayoutAnimation(
  config?: LayoutAnimationConfig,
  callback?: () => void
) {
  if (config) {
    LayoutAnimation.configureNext(config, callback);
  } else {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear, callback);
  }
}

const PresetEaseInOut = LayoutAnimation.Presets.easeInEaseOut;
const PresetLinear = LayoutAnimation.Presets.linear;
const PresetSpring = LayoutAnimation.Presets.spring;
export default {
  enableAndroidLayoutAnimation,
  setLayoutAnimation,
  Toast,
  ListItem,
  Keyboard,
  PresetEaseInOut,
  PresetLinear,
  PresetSpring
};
