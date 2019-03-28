import React from "react";
import { Navigator } from "Navigation";
import { SplashScreen } from "Components";
import { Authentication } from "Services";
import RNSplashScreen from "react-native-splash-screen";

class Start extends React.Component {
  private timeoutHandler: any;

  private start = () => {
    Authentication.createSession()
      .then(success => {
        RNSplashScreen.hide();
        this.timeoutHandler = setTimeout(() => Navigator.navTo("Home"), 500);
      })
      .catch(error => {
        RNSplashScreen.hide();
        this.timeoutHandler = setTimeout(
          () => Navigator.navTo("Authentication"),
          500
        );
      });
  };

  componentWillMount() {
    this.start();
  }

  componentWillUnmount() {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
      this.timeoutHandler = 0;
    }
  }

  render() {
    return <SplashScreen />;
  }
}

export default Start;
