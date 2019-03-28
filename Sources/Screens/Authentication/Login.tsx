import React from "react";
import { View, Image, StyleSheet } from "react-native";
import {
  InputGroup,
  Button,
  TextInput,
  ScrollView,
  StatusBar
} from "Components";
import { Strings } from "Localization";
import { Navigator } from "Navigation";
import { Authentication } from "Services";
import Assets from "Assets";

class Login extends React.Component {
  private inputsRef = React.createRef<InputGroup>();

  private onLogin = () => {
    const inputsRef = this.inputsRef.current;
    if (!inputsRef) return;
    const [username = "", password = ""] = inputsRef.getAllText();
    if (username === "") {
      Navigator.alertShow(Strings.alert.missingUsername, () =>
        inputsRef.focus(0)
      );
      return;
    }

    if (password === "") {
      Navigator.alertShow(Strings.alert.missingPassword, () =>
        inputsRef.focus(1)
      );
      return;
    }

    Navigator.showLoading(Strings.alert.authorizing);
    Authentication.loginAndCreateSession(username, password)
      .then(role => {
        Navigator.hideLoading(() => Navigator.navTo("Home"));
      })
      .catch(error => {
        Navigator.hideLoading(() =>
          Navigator.alertShow(Strings.alert.loginFail)
        );
      });
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.container}>
            <InputGroup
              ref={this.inputsRef}
              spacing={20}
              onInputSubmit={this.onLogin}
            >
              <TextInput
                underlineWidth={1}
                inputStyle={styles.input}
                helperStyle={styles.helperText}
                helperText={Strings.auth.username}
                LeftComponent={
                  <Image
                    style={styles.leftImage}
                    source={Assets.images.username}
                  />
                }
              />
              <TextInput
                underlineWidth={1}
                inputStyle={styles.input}
                helperStyle={styles.helperText}
                helperText={Strings.auth.password}
                secureTextEntry={true}
                LeftComponent={
                  <Image
                    style={styles.leftImage}
                    source={Assets.images.password}
                  />
                }
              />
            </InputGroup>
            <Button
              text={Strings.auth.login}
              style={styles.buttonLogin}
              buttonStyle={{ paddingVertical: 10 }}
              onPress={this.onLogin}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  helperText: {
    marginLeft: 53,
    marginBottom: 7,
    fontSize: 13,
    fontFamily: Assets.font.avenir.mediumOblique,
    color: Assets.colors.slate
  },
  container: {
    marginTop: 120,
    marginLeft: 60,
    marginRight: 60
  },
  buttonLogin: {
    marginTop: 40
  },
  leftImage: {
    marginLeft: 17,
    marginBottom: 8
  },
  input: {
    fontSize: 17,
    fontFamily: Assets.font.avenir.medium,
    color: Assets.colors.slate,
    marginLeft: 20
  }
});
export default Login;
