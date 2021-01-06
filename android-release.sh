#!/bin/sh

rm -rf ./android || true
npx cap add android
node ./scripts/androidResources.js

mkdir release/android || true
rm -rf ./release/android/*.*

cd android
#Version code
versionCode="100"
IFS='.' # period is set as delimiter
read -ra ADDR <<< "$1" # $1 (version number) is read into an array as tokens separated by IFS
for i in "${ADDR[@]}"; do # access each element of array
    if [ ${#i} -eq 1 ]
        then
            i="0$i"
    fi
    versionCode+="$i"
done
echo "Version code: $versionCode"
sed -in "s!versionCode 1!versionCode $versionCode!g" ./app/build.gradle
#Version name
sed -in "s!versionName \"1.0\"!versionName \"$1\"!g" ./app/build.gradle

./gradlew assembleRelease
./gradlew bundleRelease
cd ..
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./luna.keystore ./android/app/build/outputs/apk/release/app-release-unsigned.apk luna --storepass junkies3695
zipalign -v 4 ./android/app/build/outputs/apk/release/app-release-unsigned.apk ./release/android/app.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./luna.keystore ./android/app/build/outputs/bundle/release/app-release.aab luna --storepass junkies3695
cp ./android/app/build/outputs/bundle/release/app-release.aab ./release/android/app.aab
rm ./android/app/build/outputs/apk/release/app-release-unsigned.apk