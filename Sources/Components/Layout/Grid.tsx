import React from "react";
import { View } from "react-native";
import { GridProps } from "Types";
import Row from "./Row";
import { Touchable } from "Components";

const chunk = (arr: Array<any>, n: number) =>
  Array.from(Array(Math.ceil(arr.length / n)), (_, i) =>
    arr.slice(i * n, i * n + n)
  );

const prepareData = (data: any, itemsPerRow: number) => {
  const rows = chunk(data, itemsPerRow);
  if (rows.length) {
    const lastRow = rows[rows.length - 1];
    for (let i = 0; lastRow.length < itemsPerRow; i += 1) {
      lastRow.push(null);
    }
  }
  return rows;
};

type Props = GridProps;

class Grid extends React.Component<Props> {
  render() {
    const { style, children, numCols = 1, onPress } = this.props;
    if (numCols === 1) {
      return <View style={style}>{children}</View>;
    }

    const rows = prepareData(this.props.children, numCols);
    const items = rows.map((item, index) => {
      return (
        <Row key={index}>
          {React.Children.map(item, (it, idx) => {
            return it;
          })}
        </Row>
      );
    });

    if (onPress && typeof onPress === "function") {
      return (
        <Touchable style={style} onPress={onPress}>
          <View>{items}</View>
        </Touchable>
      );
    }
    return <View style={style}>{items}</View>;
  }
}

export default Grid;
