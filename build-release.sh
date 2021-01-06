#!/bin/sh

set -e
#App name
if [ -z "$1" ]
  then
    echo "Please specify app name"
    exit 1
fi
#App version
if [ -z "$2" ]
  then
    echo "Please specify app version"
    exit 1
fi

yarn install
yarn upgrade lunacomm
yarn build
yarn resources

echo "Preparation Done."

#Platform
if [ "$3" == "android" ] || [ "$3" == "all" ] || [ -z "$3" ]
  then
    echo "Build Android..."
    ./android-release.sh "$2"
fi
if [ "$3" == "ios" ] || [ "$3" == "all" ] || [ -z "$3" ]
  then
    echo "Build iOS..."
    ./ios-release.sh "$2"
fi
if [ "$3" == "androidDebug" ]
  then
    echo "Debug Android..."
    ./android-debug.sh "$2"
fi