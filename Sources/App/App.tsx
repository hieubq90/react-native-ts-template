import React from "react";
import RNSplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { configStore } from "ReduxManager";
import { Navigator, AppContainer } from "Navigation";
import { NetInfo, Loading, Alert, CodePushUpdate } from "Components";

const { store, persistor } = configStore();

export class App extends React.Component {
  private loadingRef = React.createRef<Loading>();
  private alertRef = React.createRef<Alert>();

  async componentDidMount() {
    if (__DEV__) {
      RNSplashScreen.hide();
    }
  }

  showLoading = (msg?: string) => {
    if (this.loadingRef.current) this.loadingRef.current.show(msg);
  };

  hideLoading = (onClose?: () => void) => {
    if (this.loadingRef.current) this.loadingRef.current.hide(onClose);
  };

  alertShow = (msg: string, onClose?: () => void) => {
    if (this.alertRef.current) this.alertRef.current.show(msg, onClose);
  };

  alertConfirm = (msg: string, onOk?: () => void, onCancel?: () => void) => {
    if (this.alertRef.current)
      this.alertRef.current.confirm(msg, onOk, onCancel);
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContainer
            ref={r => {
              Navigator.setRoot(r);
            }}
            screenProps={{
              showLoading: this.showLoading,
              hideLoading: this.hideLoading,
              alertShow: this.alertShow,
              alertConfirm: this.alertConfirm
            }}
          />
          <Loading ref={this.loadingRef} />
          <Alert ref={this.alertRef} />
          <NetInfo />
          <CodePushUpdate />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
