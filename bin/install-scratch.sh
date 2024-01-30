#!/bin/bash
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd $SCRIPT_PATH/..

# Set parameters
ORG_ALIAS="recipes"

echo ""
echo "Installing LWC Recipes scratch org ($ORG_ALIAS)"
echo ""

# Install script
echo "Cleaning previous scratch org..."
sf org delete scratch -p -o $ORG_ALIAS &> /dev/null
echo ""

echo "Creating scratch org..." && \
sf org create scratch -f config/project-scratch-def.json -a $ORG_ALIAS -d -y 30 && \
echo "" && \

echo "Pushing source..." && \
sf project deploy start && \
echo "" && \

echo "Assigning permission sets..." && \
sf org assign permset -n recipes && \
echo "" && \

echo "Importing sample data..." && \
sf data tree import -p data/data-plan.json && \
echo "" && \

echo "Opening org..." && \
sf org open -p lightning/n/Hello && \
echo ""

EXIT_CODE="$?"
echo ""

# Check exit code
echo ""
if [ "$EXIT_CODE" -eq 0 ]; then
  echo "Installation completed."
else
    echo "Installation failed."
fi
exit $EXIT_CODE
