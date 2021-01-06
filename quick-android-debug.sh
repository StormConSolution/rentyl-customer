#!/bin/sh

npx cap sync 

appId=$(cat capacitor.config.json | grep appId | sed 's!     !!g; s! !!g; s!\"!!g; s!:!!g; s!,!!g; s!appId!!g')
appId=${appId//[[:space:]]/}
packageId="$appId/$appId.MainActivity"
echo "Package: $packageId"

cd android
./gradlew installDebug
adb shell am start -n $packageId
