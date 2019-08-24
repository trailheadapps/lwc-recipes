#!/usr/bin/env bash

set -o errexit    # always exit on error
set -o pipefail   # don't ignore exit codes when piping output
set -o nounset    # fail on unset variables

#################################################################
# Script to setup a fully configured pipeline for Salesforce DX #
#################################################################

### Declare values

# Name of your team (optional)
HEROKU_TEAM_NAME=""

# Descriptive name for the Heroku app (e.g. gifter)
HEROKU_APP_NAME="nunchucks"

# Name of the Heroku apps you'll use
HEROKU_DEV_APP_NAME="$HEROKU_APP_NAME-dev"
HEROKU_STAGING_APP_NAME="$HEROKU_APP_NAME-staging"
HEROKU_PROD_APP_NAME="$HEROKU_APP_NAME-prod"

# Pipeline
HEROKU_PIPELINE_NAME="$HEROKU_APP_NAME-pipeline"

# Usernames or aliases of the orgs you're using
DEV_HUB_USERNAME="sebastian.labrador@cygrp.com"
DEV_USERNAME="test-4q7ure2iop6d@example.com"
STAGING_USERNAME="test-hufk71nqtzjn@example.com"
PROD_USERNAME="sebastian.labrador@cygrp.com"

# Repository with your code (e.g. wadewegner/GIFter)
GITHUB_REPO="https://github.com/slabrador09/lwc-recipes"

# Your package name (e.g. GIFter)
PACKAGE_NAME="nunchucks"

### Setup script

# Support a Heroku team
HEROKU_TEAM_FLAG=""
if [ ! "$HEROKU_TEAM_NAME" == "" ]; then
  HEROKU_TEAM_FLAG="-t $HEROKU_TEAM_NAME"
fi

# Clean up script (in case something goes wrong)
echo "heroku pipelines:destroy $HEROKU_PIPELINE_NAME
heroku apps:destroy -a $HEROKU_DEV_APP_NAME -c $HEROKU_DEV_APP_NAME
heroku apps:destroy -a $HEROKU_STAGING_APP_NAME -c $HEROKU_STAGING_APP_NAME
heroku apps:destroy -a $HEROKU_PROD_APP_NAME -c $HEROKU_PROD_APP_NAME
rm -- \"destroy$HEROKU_APP_NAME.sh\"" > destroy$HEROKU_APP_NAME.sh

echo ""
echo "Run ./destroy$HEROKU_APP_NAME.sh to remove resources"
echo ""

chmod +x "destroy$HEROKU_APP_NAME.sh"

# Create three Heroku apps to map to orgs
heroku apps:create $HEROKU_DEV_APP_NAME $HEROKU_TEAM_FLAG
heroku apps:create $HEROKU_STAGING_APP_NAME $HEROKU_TEAM_FLAG
heroku apps:create $HEROKU_PROD_APP_NAME $HEROKU_TEAM_FLAG

# Set the stage (since STAGE isn't required, review apps don't get one)
heroku config:set STAGE=DEV -a $HEROKU_DEV_APP_NAME
heroku config:set STAGE=STAGING -a $HEROKU_STAGING_APP_NAME
heroku config:set STAGE=PROD -a $HEROKU_PROD_APP_NAME

# Set whether or not to use DCP packaging
heroku config:set SFDX_INSTALL_PACKAGE_VERSION=true -a $HEROKU_DEV_APP_NAME
heroku config:set SFDX_INSTALL_PACKAGE_VERSION=true -a $HEROKU_STAGING_APP_NAME
heroku config:set SFDX_INSTALL_PACKAGE_VERSION=true -a $HEROKU_PROD_APP_NAME

# Set whether to create package version
heroku config:set SFDX_CREATE_PACKAGE_VERSION=true -a $HEROKU_DEV_APP_NAME
heroku config:set SFDX_CREATE_PACKAGE_VERSION=false -a $HEROKU_STAGING_APP_NAME
heroku config:set SFDX_CREATE_PACKAGE_VERSION=false -a $HEROKU_PROD_APP_NAME

# Package name
heroku config:set SFDX_PACKAGE_NAME="$PACKAGE_NAME" -a $HEROKU_DEV_APP_NAME
heroku config:set SFDX_PACKAGE_NAME="$PACKAGE_NAME" -a $HEROKU_STAGING_APP_NAME
heroku config:set SFDX_PACKAGE_NAME="$PACKAGE_NAME" -a $HEROKU_PROD_APP_NAME

# Turn on debug logging
heroku config:set SFDX_BUILDPACK_DEBUG=true -a $HEROKU_DEV_APP_NAME
heroku config:set SFDX_BUILDPACK_DEBUG=true -a $HEROKU_STAGING_APP_NAME
heroku config:set SFDX_BUILDPACK_DEBUG=true -a $HEROKU_PROD_APP_NAME

# Setup sfdxUrl's for Dev Hub auth
devHubSfdxAuthUrl=$(sfdx force:org:display --verbose -u $DEV_HUB_USERNAME --json | jq -r .result.sfdxAuthUrl)
heroku config:set SFDX_DEV_HUB_AUTH_URL=$devHubSfdxAuthUrl -a $HEROKU_DEV_APP_NAME
heroku config:set SFDX_DEV_HUB_AUTH_URL=$devHubSfdxAuthUrl -a $HEROKU_STAGING_APP_NAME
heroku config:set SFDX_DEV_HUB_AUTH_URL=$devHubSfdxAuthUrl -a $HEROKU_PROD_APP_NAME

# Setup sfdxUrl's for Org auth
devSfdxAuthUrl=$(sfdx force:org:display --verbose -u $DEV_USERNAME --json | jq -r .result.sfdxAuthUrl)
heroku config:set SFDX_AUTH_URL=$devSfdxAuthUrl -a $HEROKU_DEV_APP_NAME

stagingSfdxAuthUrl=$(sfdx force:org:display --verbose -u $STAGING_USERNAME --json | jq -r .result.sfdxAuthUrl)
heroku config:set SFDX_AUTH_URL=$stagingSfdxAuthUrl -a $HEROKU_STAGING_APP_NAME

prodSfdxAuthUrl=$(sfdx force:org:display --verbose -u $PROD_USERNAME --json | jq -r .result.sfdxAuthUrl)
heroku config:set SFDX_AUTH_URL=$prodSfdxAuthUrl -a $HEROKU_PROD_APP_NAME

# Add buildpacks to apps (to use latest remove version info)
heroku buildpacks:add -i 1 https://github.com/heroku/salesforce-cli-buildpack#v3 -a $HEROKU_DEV_APP_NAME
heroku buildpacks:add -i 1 https://github.com/heroku/salesforce-cli-buildpack#v3 -a $HEROKU_STAGING_APP_NAME
heroku buildpacks:add -i 1 https://github.com/heroku/salesforce-cli-buildpack#v3 -a $HEROKU_PROD_APP_NAME

heroku buildpacks:add -i 2 https://github.com/heroku/salesforce-buildpack#v3 -a $HEROKU_DEV_APP_NAME
heroku buildpacks:add -i 2 https://github.com/heroku/salesforce-buildpack#v3 -a $HEROKU_STAGING_APP_NAME
heroku buildpacks:add -i 2 https://github.com/heroku/salesforce-buildpack#v3 -a $HEROKU_PROD_APP_NAME

# Create Pipeline
heroku pipelines:create $HEROKU_PIPELINE_NAME -a $HEROKU_DEV_APP_NAME -s development $HEROKU_TEAM_FLAG
heroku pipelines:add $HEROKU_PIPELINE_NAME -a $HEROKU_STAGING_APP_NAME -s staging
heroku pipelines:add $HEROKU_PIPELINE_NAME -a $HEROKU_PROD_APP_NAME -s production

heroku ci:config:set -p $HEROKU_PIPELINE_NAME SFDX_DEV_HUB_AUTH_URL=$devHubSfdxAuthUrl
heroku ci:config:set -p $HEROKU_PIPELINE_NAME SFDX_AUTH_URL=$devSfdxAuthUrl
heroku ci:config:set -p $HEROKU_PIPELINE_NAME SFDX_BUILDPACK_DEBUG=true
heroku ci:config:set -p $HEROKU_PIPELINE_NAME SFDX_INSTALL_PACKAGE_VERSION=true
heroku ci:config:set -p $HEROKU_PIPELINE_NAME SFDX_CREATE_PACKAGE_VERSION=false
heroku ci:config:set -p $HEROKU_PIPELINE_NAME SFDX_PACKAGE_NAME="$PACKAGE_NAME"
heroku ci:config:set -p $HEROKU_PIPELINE_NAME HEROKU_APP_NAME="$HEROKU_APP_NAME"

# Setup your pipeline
heroku pipelines:connect $HEROKU_PIPELINE_NAME --repo $GITHUB_REPO
heroku reviewapps:enable -p $HEROKU_PIPELINE_NAME -a $HEROKU_DEV_APP_NAME --autodeploy --autodestroy