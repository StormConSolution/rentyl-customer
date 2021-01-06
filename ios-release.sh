rm -rf ./ios || true
npx cap add ios
node ./scripts/iOS_Resources.js

mkdir release/ios || true
rm -rf ./release/ios/*.*

cd ios/App
#Version
sed -in "s!<string>1.0</string>!<string>$1</string>!g" ./App/Info.plist
#Build
#sed -in 's!<string>1</string>!<string>5</string>!g' ./app/build.gradle

xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath App.xcarchive -allowProvisioningUpdates archive DEVELOPMENT_TEAM=QQPD9BB4K6
xcodebuild -exportArchive -archivePath App.xcarchive -exportOptionsPlist ../../luna.exportOptions.plist -exportPath ../../release/ios -allowProvisioningUpdates