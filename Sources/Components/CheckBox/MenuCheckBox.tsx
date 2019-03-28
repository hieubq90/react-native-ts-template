import React from "react";
import Grid from "../Layout/Grid";
import { MenuCheckBoxProps, CheckBoxProps } from "Types";
import { CheckBox } from "Components";

type Props = MenuCheckBoxProps;

type State = {
  currentIndex: number;

  selectedIndexs: Array<{ index: number; checked: boolean }>;
};

class MenuCheckBox extends React.Component<Props, State> {
  private checkBoxRefs: Array<CheckBox> = [];

  constructor(props: Props) {
    super(props);
    const { initialSelectedIndex = 0, children } = props;
    const length = children.length;
    this.state = {
      currentIndex: initialSelectedIndex,
      selectedIndexs: Array.from(Array(length).keys()).map(index => {
        return {
          index,
          checked: index === 0
        };
      })
    };
  }

  static defaultProps: Props = {
    multipleSelect: true,
    children: []
  };

  private onPress = (index: number) => {
    const { currentIndex } = this.state;
    const { multipleSelect } = this.props;
    const checkBox = this.checkBoxRefs[index];
    if (!checkBox) return;

    if (multipleSelect) {
      checkBox.toggle(checked => {
        let temp = [...this.state.selectedIndexs];
        temp[index].checked = checked;
        const checkedItems = temp.filter(item => item.checked);
        this.setState({ selectedIndexs: temp }, () => {
          const { onItemsSelected } = this.props;
          if (onItemsSelected) {
            onItemsSelected(checkedItems);
          }
        });
      });
    } else {
      if (currentIndex === index) {
        checkBox.toggle();
      } else {
        const currentCheckBox = this.checkBoxRefs[currentIndex];
        if (currentCheckBox) {
          currentCheckBox.toggle(() => {
            this.setState({
              currentIndex: index
            });
          });
        }
        checkBox.toggle();
      }
      if (this.props.onItemSelected) {
        this.props.onItemSelected(index);
      }
    }
  };

  render() {
    const { style, children, numCols, multipleSelect } = this.props;
    if (multipleSelect) {
    }

    const items = React.Children.map(children, (child, index) => {
      if (React.isValidElement<CheckBoxProps>(child)) {
        return React.cloneElement(child, {
          checked: !multipleSelect && index === this.state.currentIndex,
          onPress: () => this.onPress(index),
          // @ts-ignore
          ref: (node: any) => {
            if (node) this.checkBoxRefs.push(node);
          }
        });
      }

      return null;
    });
    return (
      <Grid style={style} numCols={numCols}>
        {items}
      </Grid>
    );
  }
}

export default MenuCheckBox;
