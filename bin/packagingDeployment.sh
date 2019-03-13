#!/bin/bash

# Default values
BRANCH=$1
SFDX_CLI_EXEC=sfdx
TARGET_ORG='packaging@trailheadapps.org'
RESULT=0

# Defining Salesforce CLI exec, depending if it's CI or local dev machine
if [ $CI ]; then
  echo "Script is running on CI"
  SFDX_CLI_EXEC=node_modules/sfdx-cli/bin/run
  TARGET_ORG="packagingorg"
fi

PACKAGE_VERSION="$($SFDX_CLI_EXEC force:package:version:create -p LWCRecipes -x -w 10 --json)"
RESULT="$(echo $PACKAGE_VERSION | jq '.status')"
echo "Result is $RESULT"

if [ -z $RESULT ]; then
  exit 1
fi

if [ $RESULT -gt 0 ]; then
  echo $PACKAGE_VERSION
  exit 1
else
  sleep 300
fi

PACKAGE_VERSION="$(echo $PACKAGE_VERSION | jq '.result.SubscriberPackageVersionId' | tr -d '"')"

$SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION -w 10 -u $TARGET_ORG -r
echo "Done"