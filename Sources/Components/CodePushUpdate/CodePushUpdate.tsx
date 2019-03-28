import React from "react";
import CodePush, {
  RemotePackage,
  DownloadProgress,
  CodePushOptions
} from "react-native-code-push";
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Animated
} from "react-native";
import { Strings } from "Localization";
import Text from "../Text/Text";
import Assets from "Assets";
import Button from "../Button/Button";

const { width, height } = Dimensions.get("window");
const dialogWidth = width - 20;
const progressBarWidth = dialogWidth - 40;
const isIOS = Platform.OS === "ios";

const stagingKey_iOS = "Rs4a8GK_xYXgT1rM8JAD7WZGvmj8rJqX-e8vV";
const stagingKey_android = "e90xvsrSJHJZM9EPaOfTCifnXeNEr1M4d-LPN";
const stagingKey = isIOS ? stagingKey_iOS : stagingKey_android;

const productionKey_iOS = "BVJDrKS6I9vmtcbuzV_INihwJT0UH1N80fID4";
const productionKey_android = "GTLh_JIw3kdViaVRhtrZRxkwwYIMryKHAGUwE";
const productionKey = isIOS ? productionKey_iOS : productionKey_android;

const deploymentKey = __DEV__ ? stagingKey : productionKey;

type CodePushState = "None" | "Updated" | "Syncing" | "Update";

type Props = {
  deploymentKey?: string;
};

type State = {
  isMandatory: boolean;
  updateInfo: RemotePackage | null;
  currentProgress: number;
  syncMessage: string;
  state: CodePushState;
  animatedProgressValue: Animated.Value;
  animatedOpacityValue: Animated.Value;
  animatedScaleValue: Animated.Value;
};

type StateKey = { [key in CodePushState]: string };

class CodePushUpdate extends React.Component<Props, State> {
  private titles: StateKey = {
    None: Strings.codepush.updateAvailable,
    Syncing: Strings.codepush.updateInProgress,
    Update: Strings.codepush.updateAvailable,
    Updated: Strings.codepush.updateInstalled
  };

  static defaultProps: Props = {
    deploymentKey
  };

  state: State = {
    updateInfo: null,
    isMandatory: false,
    currentProgress: 0,
    syncMessage: "",
    state: "None",
    animatedProgressValue: new Animated.Value(0),
    animatedOpacityValue: new Animated.Value(0),
    animatedScaleValue: new Animated.Value(0)
  };

  componentWillMount() {
    CodePush.disallowRestart();
  }

  componentDidMount() {
    CodePush.allowRestart();
    this.syncImmediate();
  }

  private show = () => {
    const { animatedOpacityValue, animatedScaleValue } = this.state;
    Animated.sequence([
      Animated.timing(animatedOpacityValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(animatedScaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  private hide = () => {
    const { animatedOpacityValue, animatedScaleValue } = this.state;
    Animated.sequence([
      Animated.timing(animatedScaleValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(animatedOpacityValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start(() => this.setState({ state: "None" }));
  };

  private syncImmediate() {
    CodePush.checkForUpdate(this.props.deploymentKey).then(update => {
      if (update) {
        console.log("------- CodePush checkForUpdate -------");
        console.log(update);
        const isMandatory = update.isMandatory;
        this.setState(
          { isMandatory, updateInfo: update, state: "Update" },
          this.show
        );
      }
    });
  }

  private immediateUpdate = () => {
    const { state } = this.state;
    if (state !== "Syncing") {
      this.setState({ state: "Syncing" }, () => {
        let codePushOptions = {
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
          mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
          deploymentKey: this.props.deploymentKey
        };
        CodePush.sync(
          codePushOptions,
          this.codePushStatusDidChange.bind(this),
          this.codePushDownloadDidProgress.bind(this)
        );
      });
    }
  };

  private codePushStatusDidChange(syncStatus: CodePush.SyncStatus) {
    console.log("------- CodePush codePushStatusDidChange -------");
    console.log(syncStatus);
    let syncMessage = "";
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        syncMessage = "Checking for update";
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        syncMessage = "Downloading package";
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        syncMessage = "Awaiting user action";
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        syncMessage = "Installing update";
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        syncMessage = "App up to date.";
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        syncMessage = "Update cancelled by user";
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        syncMessage = "Update installed and will be applied on restart.";
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        syncMessage = "An unknown error occurred";
        const { animatedOpacityValue, animatedScaleValue } = this.state;
        Animated.sequence([
          Animated.timing(animatedScaleValue, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
          }),
          Animated.timing(animatedOpacityValue, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
          })
        ]).start(() => this.setState({ state: "None" }));
        return;
    }
    this.setState({ syncMessage });
    console.log(syncMessage);
  }

  private codePushDownloadDidProgress(progress: DownloadProgress) {
    console.log("------- CodePush codePushDownloadDidProgress -------");
    console.log(progress);
    const { state, animatedProgressValue, isMandatory } = this.state;
    if (state === "Syncing") {
      const { receivedBytes, totalBytes } = progress;
      let temp = receivedBytes / totalBytes;
      this.setState({ currentProgress: temp }, () => {
        if (temp >= 1) {
          console.log("------- CodePush download done -------");
          if (isMandatory) {
            this.hide();
          } else {
            this.setState({ state: "Updated" });
          }
        } else {
          animatedProgressValue.setValue(temp);
        }
      });
    }
  }

  private renderDescription = () => {
    const { updateInfo } = this.state;
    if (updateInfo && updateInfo.description) {
      return <Text style={styles.description} text={updateInfo.description} />;
    }

    return null;
  };

  private restartNow = () => {
    this.setState({ state: "None" }, () => {
      CodePush.restartApp();
    });
  };

  private renderBottom = () => {
    const { state, isMandatory } = this.state;
    if (state === "Updated") {
      return (
        <View style={styles.row}>
          {!isMandatory && (
            <Button
              style={styles.deactiveButton}
              buttonStyle={{ padding: 0, height: "100%" }}
              textStyle={styles.deactiveButtonText}
              text={Strings.codepush.later}
              onPress={this.hide}
            />
          )}
          <Button
            style={styles.activeButton}
            buttonStyle={{ padding: 0, height: "100%" }}
            textStyle={styles.activeButtonText}
            text={Strings.codepush.restartNow}
            onPress={this.restartNow}
          />
        </View>
      );
    }

    if (state === "Syncing") {
      const {
        animatedProgressValue,
        syncMessage,
        currentProgress
      } = this.state;

      const translateX = animatedProgressValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-progressBarWidth, 0]
      });
      const animationStyle = {
        transform: [{ translateX }]
      };
      const color = animatedProgressValue.interpolate({
        inputRange: [0, 0.3, 0.4, 0.5, 0.6],
        outputRange: [
          "white",
          Assets.colors.slate,
          Assets.colors.slate,
          Assets.colors.slate,
          "white"
        ]
      });

      const roundedValue = (currentProgress * 100).toFixed(2);
      const progress = `${roundedValue}%`;
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.track, animationStyle]} />
            <Animated.Text style={[styles.progress, { color }]}>
              {progress}
            </Animated.Text>
          </View>
          <Text style={styles.msg} text={syncMessage} />
        </View>
      );
    }

    return (
      <View style={styles.row}>
        {!isMandatory && (
          <Button
            style={styles.deactiveButton}
            buttonStyle={{ padding: 0, height: "100%" }}
            textStyle={styles.deactiveButtonText}
            text={Strings.codepush.updateLater}
            onPress={this.hide}
          />
        )}
        <Button
          style={styles.activeButton}
          buttonStyle={{ padding: 0, height: "100%" }}
          textStyle={styles.activeButtonText}
          text={Strings.codepush.updateNow}
          onPress={this.immediateUpdate}
        />
      </View>
    );
  };

  private renderContent = () => {
    const { state } = this.state;

    if (state === "Updated") {
      return (
        <View style={styles.content}>
          <Text style={styles.header} text={Strings.codepush.newestInstalled} />
          <Text
            style={styles.confirmText}
            text={Strings.codepush.doYouWantUpdateNow}
          />
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.header} text={Strings.codepush.newFeatures} />
        {this.renderDescription()}
        <Text style={styles.confirmText} text={Strings.codepush.doYouWant} />
      </View>
    );
  };

  private getVersion = () => {
    const { updateInfo } = this.state;
    if (updateInfo) {
      const { label, appVersion } = updateInfo;
      const buildNumber = label.substring(1);
      const version = `Version: ${appVersion}(${buildNumber})`;
      return version;
    }
    return null;
  };
  render() {
    const visible = this.state.state !== "None";
    const { animatedOpacityValue, animatedScaleValue, state } = this.state;
    const version = this.getVersion();

    const opacity = animatedOpacityValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1]
    });

    const opacityStyle = {
      opacity
    };

    const scale = animatedScaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    const scaleStyle = {
      transform: [{ scale }]
    };

    const title = this.titles[state];
    return (
      <Modal transparent visible={visible}>
        <Animated.View style={[styles.modal, opacityStyle]}>
          <Animated.View style={[styles.container, scaleStyle]}>
            <Text style={styles.title} text={title} />
            {version && <Text style={styles.version} text={version} />}
            {this.renderContent()}
            <View style={styles.bottom}>{this.renderBottom()}</View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(35,36,38,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
    width: dialogWidth,
    overflow: "hidden",
    backgroundColor: "white",
    ...Platform.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
      }
    }),
    borderRadius: 14
  },
  bottom: {
    height: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 20,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.primary
  },
  header: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  content: {
    alignSelf: "flex-start",
    marginHorizontal: 20,
    marginTop: 10
  },
  description: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  activeButton: {
    marginHorizontal: 15,
    backgroundColor: Assets.colors.primary,
    height: 46,
    borderRadius: 23
  },
  activeButtonText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: "white",
    marginHorizontal: 20,
    padding: 0
  },
  deactiveButton: {
    marginHorizontal: 15,
    backgroundColor: Assets.colors.lightBlueGrey,
    height: 46,
    borderRadius: 23
  },
  deactiveButtonText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate,
    marginHorizontal: 20,
    padding: 0
  },
  progressBar: {
    width: progressBarWidth,
    height: 16,
    borderRadius: 8,
    backgroundColor: Assets.colors.lightBlueGrey,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Assets.colors.primary
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  msg: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  progress: {
    fontSize: 12,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  version: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate
  },
  confirmText: {
    fontSize: 18,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate,
    marginTop: 10,
    marginBottom: 20
  }
});

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: undefined
};

export default CodePush(codePushOptions)(CodePushUpdate);
