import React from "react";
import {
  View,
  LayoutChangeEvent,
  FlatList,
  LayoutRectangle,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from "react-native";
import { DropdownProps, DropdownItem } from "Types";
import { LayoutAnimations } from "Utils";
import Button from "../Button/Button";
import Text from "../Text/Text";

type Props = DropdownProps;
type State = {
  visible: boolean;
  layout?: LayoutRectangle;
  flatlistHeight: number;
  updateHeight: number;
  menuText: string;
};

class Dropdown extends React.Component<Props, State> {
  private menu = React.createRef<View>();
  private flatListContainerRef = React.createRef<View>();

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      flatlistHeight: 0,
      updateHeight: 0,
      menuText: props.initialText || props.items[0].text
    };
    LayoutAnimations.enableAndroidLayoutAnimation();
  }

  private onContainerLayout = (event: LayoutChangeEvent) => {
    if (this.state.layout || !this.menu.current) return;
    let layout = event.nativeEvent.layout;
    this.menu.current.measureInWindow((x, y, width, height) => {
      layout.y = y + height;
      this.setState({ layout });
    });
  };

  private onContentSizeChanged = (w: number, h: number) => {
    LayoutAnimations.setLayoutAnimation(LayoutAnimations.PresetEaseInOut);
    if (this.state.flatlistHeight === 0) {
      this.setState({ flatlistHeight: h, updateHeight: h });
    } else {
      this.setState({ updateHeight: this.state.flatlistHeight });
    }
  };

  private onShow = () => {
    this.setState({ visible: true });
  };

  private onHide = () => {
    if (Platform.OS == "android") {
      LayoutAnimations.setLayoutAnimation(LayoutAnimations.PresetEaseInOut);
      this.setState({ updateHeight: 0 }, () => {
        setTimeout(() => {
          this.setState({ visible: false });
        }, LayoutAnimations.PresetEaseInOut.duration);
      });
    } else {
      LayoutAnimations.setLayoutAnimation(
        LayoutAnimations.PresetEaseInOut,
        () => {
          this.setState({ visible: false });
        }
      );
      this.setState({ updateHeight: 0 });
    }
  };

  private onItemSelected = (item: DropdownItem, index: number) => {
    if (Platform.OS == "android") {
      LayoutAnimations.setLayoutAnimation(LayoutAnimations.PresetEaseInOut);
      this.setState({ updateHeight: 0 }, () => {
        setTimeout(() => {
          this.setState({ visible: false, menuText: item.text }, () => {
            if (this.props.onItemSelected)
              this.props.onItemSelected(item, index);
          });
        }, LayoutAnimations.PresetEaseInOut.duration);
      });
    } else {
      LayoutAnimations.setLayoutAnimation(
        LayoutAnimations.PresetEaseInOut,
        () => {
          this.setState({ visible: false, menuText: item.text }, () => {
            if (this.props.onItemSelected)
              this.props.onItemSelected(item, index);
          });
        }
      );
      this.setState({ updateHeight: 0 });
    }
  };

  private renderMenuItems = ({
    item,
    index
  }: {
    item: DropdownItem;
    index: number;
  }) => {
    const onPress = () => this.onItemSelected(item, index);
    const { text } = item;
    return (
      <TouchableOpacity onPress={onPress}>
        <Text text={text} style={{ color: "black" }} />
      </TouchableOpacity>
    );
  };

  render() {
    const { layout, updateHeight, visible, menuText } = this.state;
    const { style, buttonStyle, menuStyle, items } = this.props;
    const menuStyleOverrides: any = layout
      ? {
          left: layout.x,
          top: layout.y,
          width: layout.width,
          height: updateHeight,
          overflow: "hidden",
          position: "absolute",
          backgroundColor: "#eee"
        }
      : {};

    return (
      <View ref={this.menu} style={style} onLayout={this.onContainerLayout}>
        <Button
          text={menuText}
          onPress={this.onShow}
          style={[styles.button, buttonStyle]}
          textStyle={[styles.buttonText]}
        />
        <Modal
          transparent
          visible={visible}
          animationType="none"
          onRequestClose={this.onHide}
        >
          <TouchableWithoutFeedback onPress={this.onHide}>
            <View style={StyleSheet.absoluteFill}>
              <TouchableWithoutFeedback>
                <View
                  ref={this.flatListContainerRef}
                  style={[styles.menu, menuStyleOverrides, menuStyle]}
                >
                  <View>
                    <FlatList
                      onContentSizeChange={this.onContentSizeChanged}
                      data={items}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={this.renderMenuItems}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {},
  button: {
    backgroundColor: "#eee"
  },
  buttonText: {
    color: "black"
  }
});
export default Dropdown;
