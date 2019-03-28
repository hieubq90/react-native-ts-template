import React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView, Text, Section } from "Components";
import { Strings } from "Localization";
import { Navigator } from "Navigation";
import { Authentication } from "Services";
import { DrawerProps } from "Types";
import Assets from "Assets";
import DrawerItem from "./DrawerItem";
import DrawerHeader from "./DrawerHeader";

type Props = DrawerProps;
class Drawer extends React.Component<Props> {
  componentWillMount() {
    Navigator.setDrawer(this.props);
  }
  private onLogout = () => {
    Navigator.alertConfirm(Strings.alert.logout, () => {
      Authentication.logout().then(success => {
        Navigator.reset("Authentication");
      });
    });
  };

  private commingSoon = () => {
    Navigator.alertShow(Strings.drawer.commingSoon);
  };

  render() {
    const { drawerOpenProgress } = this.props;
    return (
      <View style={StyleSheet.absoluteFill}>
        <ScrollView>
          <View style={styles.container}>
            <DrawerHeader
              drawerOpenProgress={drawerOpenProgress}
              imageSource={Assets.images.drawerLogo}
            />
            <View style={{ paddingLeft: 24 }}>
              <DrawerItem
                text={Strings.drawer.scanBarcode}
                onPress={this.commingSoon}
              />
              <DrawerItem
                text={Strings.drawer.language}
                onPress={this.commingSoon}
              />
            </View>
            <Section text={Strings.drawer.account} />
            <View style={{ paddingLeft: 24 }}>
              <DrawerItem
                leftIconSource={Assets.images.profile}
                text={Strings.drawer.profile}
                onPress={this.commingSoon}
              />
              <DrawerItem
                leftIconSource={Assets.images.changePassword}
                text={Strings.drawer.changePassword}
                onPress={this.commingSoon}
              />
            </View>
            <Section text={Strings.drawer.help} />
            <View style={{ paddingLeft: 24 }}>
              <DrawerItem
                leftIconSource={Assets.images.faq}
                text={Strings.drawer.faq}
                onPress={this.commingSoon}
              />
              <DrawerItem
                leftIconSource={Assets.images.settings}
                text={Strings.drawer.settings}
                onPress={this.commingSoon}
              />
              <DrawerItem
                leftIconSource={Assets.images.contactUs}
                text={Strings.drawer.contactUs}
                onPress={this.commingSoon}
              />
              <DrawerItem
                leftIconSource={Assets.images.logout}
                text={Strings.drawer.logout}
                onPress={this.onLogout}
              />
            </View>
          </View>
        </ScrollView>
        <Text style={styles.version} text="Version 1.0" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20
  },
  section: {
    marginTop: 5,
    backgroundColor: Assets.colors.primary
  },
  version: {
    zIndex: 2,
    position: "absolute",
    bottom: 10,
    right: 18,
    fontSize: 14,
    fontFamily: Assets.font.avenir.book,
    color: Assets.colors.slate
  },
  sectionText: {
    paddingVertical: 5,
    paddingLeft: 24,
    fontSize: 16,
    fontFamily: Assets.font.avenir.medium,
    color: "white"
  }
});

export default Drawer;
