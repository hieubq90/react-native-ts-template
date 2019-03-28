import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import { Start, Drawer } from "Screens";
import { Dimensions } from "react-native";
import AuthenticationStack from "./AuthenticationStack";
import HomeStack from "./HomeStack";
import getSlideFromRightTransitionConfig from "./transitionConfig";

const { width } = Dimensions.get("window");
const drawerWidth = width * 0.7;
const drawerConfig: any = {
  drawerPosition: "left",
  overlayColor: "rgba(0,0,0,0.3)",
  drawerType: "front",
  useNativeAnimations: true,
  drawerWidth,
  defaultNavigationOptions: {
    header: null
  }
};

const HomeDrawerStack = createDrawerNavigator(
  {
    HomeStack: HomeStack
  },
  {
    initialRouteName: "HomeStack",
    contentComponent: Drawer,
    ...drawerConfig
  }
);

const RootStack = createStackNavigator(
  {
    Authentication: AuthenticationStack,
    Home: HomeDrawerStack,
    Start: Start
  },
  {
    initialRouteName: "Start",
    transitionConfig: getSlideFromRightTransitionConfig,
    headerMode: "none",
    defaultNavigationOptions: {
      swipeEnabled: false,
      gesturesEnabled: false,
      header: null
    }
  }
);

const AppContainer = createAppContainer(RootStack);

export default AppContainer;
