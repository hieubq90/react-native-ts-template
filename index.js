import { AppRegistry } from "react-native";
import { name as appName } from "./Sources/App/app.json";
import App from "./Sources/App/App";

AppRegistry.registerComponent(appName, () => App);

console.disableYellowBox = true;
