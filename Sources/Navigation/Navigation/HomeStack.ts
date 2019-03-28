import { createStackNavigator } from "react-navigation";
import { Home } from "Screens";
import getSlideFromRightTransitionConfig from "./transitionConfig";

const HomeStack = createStackNavigator(
  {
    Home: Home
  },
  {
    transitionConfig: getSlideFromRightTransitionConfig,
    initialRouteName: "Home",
    defaultNavigationOptions: ({ navigation }) => {
      const gesturesEnabled = navigation.getParam("swipeBackEnabled", true);
      return {
        header: null,
        gesturesEnabled
      };
    },
    navigationOptions: ({ navigation }) => {
      const params =
        navigation.state.routes[navigation.state.index].params || {};
      return {
        drawerLockMode: params.drawerLockMode
      };
    }
  }
);

export default HomeStack;
