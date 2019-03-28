module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {
      plugins: ["transform-remove-console"]
    }
  },
  plugins: [
    [
      "module-resolver",
      {
        root: ["./Sources"],
        extensions: [".ios.js", ".android.js", ".js", ".json"],
        alias: {
          App: "./Sources/App",
          Assets: "./Sources/Assets",
          Components: "./Sources/Components",
          Localization: "./Sources/Localization",
          Models: "./Sources/Models",
          Navigation: "./Sources/Navigation",
          ReduxManager: "./Sources/ReduxManager",
          Screens: "./Sources/Screens",
          Services: "./Sources/Services",
          Types: "./Sources/Types",
          Utils: "./Sources/Utils",
          Styles: "./Sourecs/Styles"
        }
      }
    ]
  ]
};
