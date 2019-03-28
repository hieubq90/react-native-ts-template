import React from "react";
import { Path, Circle, Linecap } from "react-native-svg";

const CIRCLE = Math.PI * 2;
type Props = {
  startAngle: number;
  endAngle: number;
  radius: number;
  offset?: { top: number; left: number };
  strokeLinecap?: Linecap;
  strokeWidth?: number;
  strokeColor?: string;
  direction?: "cw" | "ccw";
};

class Arc extends React.Component<Props> {
  static defaultProps: Props = {
    startAngle: 0,
    endAngle: Math.PI / 6,
    radius: 30,
    strokeLinecap: "butt",
    strokeWidth: 2,
    direction: "cw",
    strokeColor: "red"
  };

  render() {
    const {
      radius,
      strokeLinecap,
      strokeWidth = 2,
      strokeColor,
      offset = { top: 0, left: 0 }
    } = this.props;
    let startAngle = this.props.startAngle;
    let endAngle = this.props.endAngle;
    if (endAngle - startAngle >= CIRCLE) {
      endAngle = CIRCLE + (endAngle % CIRCLE);
    } else {
      endAngle = endAngle % CIRCLE;
    }
    startAngle = startAngle % CIRCLE;
    const angle =
      startAngle > endAngle
        ? CIRCLE - startAngle + endAngle
        : endAngle - startAngle;
    const x = offset.left + strokeWidth / 2;
    const y = offset.top + strokeWidth / 2;
    if (angle >= CIRCLE) {
      return (
        <Circle
          x={x}
          y={y}
          cx={radius}
          cy={radius}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          stroke={strokeColor}
          fill="none"
        />
      );
    }

    const { direction } = this.props;
    const directionFactor = direction === "cw" ? 1 : -1;
    endAngle *= directionFactor;
    startAngle *= directionFactor;
    const startSine = Math.sin(startAngle);
    const startCosine = Math.cos(startAngle);
    const endSine = Math.sin(endAngle);
    const endCosine = Math.cos(endAngle);

    const arcFlag = angle > Math.PI ? 1 : 0;
    const reverseFlag = direction === "cw" ? 1 : 0;

    const d = `M${x + radius * (1 + startSine)} ${y +
      radius -
      radius * startCosine}
          A${radius} ${radius} 0 ${arcFlag} ${reverseFlag} ${x +
      radius * (1 + endSine)} ${y + radius - radius * endCosine}`;

    return (
      <Path d={d} fill="none" strokeWidth={strokeWidth} stroke={strokeColor} />
    );
  }
}

export default Arc;
