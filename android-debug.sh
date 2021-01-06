#!/bin/sh

rm -rf ./android || true
npx cap add android
node ./scripts/androidResources.js

appId=$(cat capacitor.config.json | grep appId | sed 's!     !!g; s! !!g; s!\"!!g; s!:!!g; s!,!!g; s!appId!!g')
appId=${appId//[[:space:]]/}
packageId="$appId/$appId.MainActivity"
echo "Package: $packageId"

cd android
#Version code
sed -in "s!versionCode 1!versionCode 100${1//\./}!g" ./app/build.gradle
#Version name
sed -in "s!versionName \"1.0\"!versionName \"$1\"!g" ./app/build.gradle

./gradlew installDebug
adb shell am start -n $packageId