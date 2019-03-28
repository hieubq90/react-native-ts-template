const fs = require("fs");
const path = require("path");
const { name } = require("../../app.json");
const rootDir = path.join(__dirname, "../../");

function install() {
  // For ios
  const ios_dir = path.join(rootDir, `ios/${name}`);
  const appDelegateFile = path.join(ios_dir, "AppDelegate.m");
  fs.readFile(appDelegateFile, "utf8", function(err, data) {
    if (err) {
      return console.error(err);
    }
    let result = data.replace(
      "return YES;",
      "[RNSplashScreen show];\n\treturn YES;"
    );
    result = result.replace(
      "#import <React/RCTRootView.h>",
      '#import <React/RCTRootView.h>\n#import "RNSplashScreen.h"'
    );

    fs.writeFile(appDelegateFile, result, "utf8", function(err) {
      if (err) return console.error(err);
    });
  });

  // // For Android
  // const android_styles_dir = path.join(
  //   rootDir,
  //   `android/app/src/main/res/values/styles.xml`
  // );
  // fs.readFile(android_styles_dir, "utf8", function(err, data) {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   let result = data.replace(
  //     "<!-- Customize your theme here. -->",
  //     '<item name="android:windowIsTranslucent">true</item>'
  //   );
  //   result = result.replace();

  //   fs.writeFile(android_styles_dir, result, "utf8", function(err) {
  //     if (err) return console.error(err);
  //   });
  // });

  const android_manifest_dir = path.join(
    rootDir,
    `android/app/src/main/AndroidManifest.xml`
  );
  fs.readFile(android_manifest_dir, "utf8", function(err, data) {
    if (err) {
      return console.error(err);
    }
    let result = data.replace(
      '<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>',
      '<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>\n\t<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>'
    );
    result = result.replace(
      'android:windowSoftInputMode="adjustResize"',
      'android:windowSoftInputMode="adjustPan"'
    );

    fs.writeFile(android_manifest_dir, result, "utf8", function(err) {
      if (err) return console.error(err);
    });
  });

  function copyFileSync(source, target) {
    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
      if (fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source));
      }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
  }

  function copyFolderRecursiveSync(source, target) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
      console.log("create new folder", targetFolder);
      fs.mkdirSync(targetFolder);
    }

    //copy
    if (fs.lstatSync(source).isDirectory()) {
      console.log("isDir", source);
      files = fs.readdirSync(source);
      files.forEach(function(file) {
        var curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
          copyFolderRecursiveSync(curSource, targetFolder);
        } else {
          copyFileSync(curSource, targetFolder);
        }
      });
    }
  }

  const drawable_dir = path.join(rootDir, "android/app/src/main");
  const layout_dir = path.join(rootDir, "android/app/src/main/res/layout");
  const src_drawable_dir = path.join(__dirname, "res");
  const src_layout_dir = path.join(__dirname, "launch_screen.xml");

  if (!fs.existsSync(layout_dir)) {
    console.log("create new layout folder", layout_dir);
    fs.mkdirSync(layout_dir);
  }

  console.log({ drawable_dir, layout_dir, src_drawable_dir, src_layout_dir });
  const mainActivity_file = path.join(
    rootDir,
    `android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`
  );
  const mainActivity_src_file = path.join(__dirname, "MainActivity.java");
  copyFileSync(src_layout_dir, layout_dir);
  copyFolderRecursiveSync(src_drawable_dir, drawable_dir);

  fs.readFile(mainActivity_src_file, "utf8", function(err, data) {
    if (err) {
      return console.error(err);
    }
    let result = data.replace(
      "package com.wejelly.nedbarcode;",
      `package com.${name.toLowerCase()};`
    );
    result = result.replace('return "NedCoffee";', `return "${name}";`);

    fs.writeFile(mainActivity_file, result, "utf8", function(err) {
      if (err) return console.error(err);
    });
  });
}

module.exports.install = install;
