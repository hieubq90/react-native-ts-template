// import React from "react";
// import {
//   ART,
//   View,
//   ViewProps,
//   StyleSheet,
//   PanResponder,
//   PanResponderInstance,
//   GestureResponderEvent,
//   PanResponderGestureState,
//   LayoutChangeEvent,
//   Animated,
//   Platform
// } from "react-native";

// const { Surface, Shape } = ART;
// import Circle from "../Progress/Shapes/Circle";
// import Arc from "../Progress/Shapes/Arc";
// import { Point } from "Types";

// type Props = ViewProps & {
//   radius?: number;
//   knobRadius?: number;
//   progressTrackWidth?: number;
//   inProgressTrackWidth?: number;
//   progressTrackColor?: string;
//   inProgressTrackColor?: string;
//   onValueChanged?: (percent: number) => void;
//   initalValue?: number;
//   continous?: boolean;
// };

// type State = { center?: Point; angleInRad: number; angle: number };

// class CircleSlider extends React.Component<Props, State> {
//   private panResponder?: PanResponderInstance;
//   private containerRef = React.createRef<View>();

//   constructor(props: Props) {
//     super(props);

//     const { initalValue = 0 } = props;
//     let convertValue = initalValue - 0.25;
//     if (convertValue < 0) {
//       convertValue += 1;
//     }
//     this.state = {
//       angleInRad: convertValue * Math.PI * 2,
//       angle: 0
//     };
//   }

//   static defaultProps: Props = {
//     radius: 95,
//     knobRadius: 10,
//     progressTrackWidth: 20,
//     inProgressTrackWidth: 20,
//     inProgressTrackColor: "#ED5454",
//     progressTrackColor: "#F1F1F1"
//   };

//   componentWillMount() {
//     this.panResponder = PanResponder.create({
//       onMoveShouldSetPanResponder: (evt, gestureState) => true,
//       onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
//       onPanResponderGrant: this.onPanResponderGrant,
//       onPanResponderMove: this.onPanResponderMove,
//       onPanResponderRelease: this.onPanResponderRelease
//     });
//   }

//   private pointFromAngle(angle: number, radius: number): Point {
//     if (this.state.center) {
//       let x = radius * Math.cos(angle);
//       let y = radius * Math.sin(angle);
//       return { x, y };
//     }
//     return { x: 0, y: 0 };
//   }

//   private angleFromPoint(point: Point): number {
//     if (this.state.center) {
//       const { x, y } = this.state.center;
//       const rad = Math.atan2(point.y - y, point.x - x);
//       return rad < 0 ? rad + Math.PI * 2 : rad;
//     }
//     return 0;
//   }

//   private onPanResponderGrant = (
//     e: GestureResponderEvent,
//     gestureState: PanResponderGestureState
//   ) => {};

//   private onPanResponderRelease = (
//     e: GestureResponderEvent,
//     gestureState: PanResponderGestureState
//   ) => {
//     if (this.props.onValueChanged) {
//       const percent = this.state.angle / (Math.PI * 2);
//       console.log({ percent });
//       this.props.onValueChanged(percent);
//     }
//   };

//   private onPanResponderMove = (
//     e: GestureResponderEvent,
//     gestureState: PanResponderGestureState
//   ) => {
//     if (this.state.center) {
//       const { moveX, moveY } = gestureState;
//       const angleInRad = this.angleFromPoint({ x: moveX, y: moveY });
//       let angle = angleInRad - (3 * Math.PI) / 2;
//       if (angle < 0) {
//         angle += 2 * Math.PI;
//       }

//       this.setState({ angleInRad, angle }, () => {
//         const { continous, onValueChanged } = this.props;
//         if (continous && onValueChanged) {
//           const percent = this.state.angle / (Math.PI * 2);
//           console.log({ percent });
//           onValueChanged(percent);
//         }
//       });
//     }
//   };

//   private onLayout = (e: LayoutChangeEvent) => {
//     if (this.containerRef.current) {
//       this.containerRef.current.measure((x, y, w, h, px, py) => {
//         console.log({ x, y, w, h, px, py });
//         const centerX = x + w / 2;
//         const centerY = y + h / 2;
//         this.setState({ center: { x: centerX, y: centerY } });
//       });
//     }
//   };

//   render() {
//     const {
//       style,
//       radius,
//       knobRadius,
//       inProgressTrackWidth,
//       inProgressTrackColor,
//       progressTrackWidth,
//       progressTrackColor
//     } = this.props;
//     const { angleInRad, center, angle } = this.state;
//     const width = radius! * 2 + knobRadius!;
//     const height = width;
//     const sliderSize = radius! * 2;
//     const arcRadius = radius!;
//     const circleInsideRadius = knobRadius! - 2;
//     const { x, y } = this.pointFromAngle(angleInRad, radius! - knobRadius!);

//     return (
//       <View
//         ref={this.containerRef}
//         style={[styles.container, style, { width, height }]}
//         onLayout={this.onLayout}
//       >
//         <Surface width={sliderSize} height={sliderSize}>
//           <Arc
//             radius={arcRadius}
//             startAngle={0}
//             endAngle={Math.PI * 2}
//             direction={"clockwise"}
//             stroke={progressTrackColor}
//             strokeWidth={progressTrackWidth}
//           />
//           <Arc
//             radius={arcRadius}
//             startAngle={0}
//             endAngle={angle}
//             direction={"clockwise"}
//             stroke={inProgressTrackColor}
//             strokeWidth={inProgressTrackWidth}
//           />
//         </Surface>
//         {center !== undefined && (
//           <View
//             {...this.panResponder!.panHandlers}
//             style={[
//               styles.knob,
//               {
//                 position: "absolute",
//                 transform: [{ translateX: x }, { translateY: y }],
//                 width: knobRadius! * 2,
//                 height: knobRadius! * 2,
//                 borderRadius: knobRadius!
//               }
//             ]}
//           >
//             <View
//               style={[
//                 {
//                   width: circleInsideRadius * 2,
//                   height: circleInsideRadius * 2,
//                   borderRadius: circleInsideRadius,
//                   borderColor: "#ED5454",
//                   borderWidth: 2
//                 }
//               ]}
//             />
//           </View>
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   knob: {
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     ...Platform.select({
//       android: {
//         elevation: 2
//       },
//       ios: {
//         shadowColor: "#7C7C7C",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.2,
//         shadowRadius: 6
//       }
//     })
//   }
// });

// export default CircleSlider;
