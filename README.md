# Lightning Web Components Recipes

[![CI Workflow](https://github.com/trailheadapps/lwc-recipes/workflows/CI/badge.svg)](https://github.com/trailheadapps/lwc-recipes/actions?query=workflow%3ACI) [![Packaging Workflow](https://github.com/trailheadapps/lwc-recipes/workflows/Packaging/badge.svg)](https://github.com/trailheadapps/lwc-recipes/actions?query=workflow%3A%22Packaging%22) [![codecov](https://codecov.io/gh/trailheadapps/lwc-recipes/branch/main/graph/badge.svg)](https://codecov.io/gh/trailheadapps/lwc-recipes)

![recipes-logo](recipes-logo.png)

A collection of easy-to-digest code examples for Lightning Web Components. Each recipe demonstrates how to code a specific task in the fewest lines of code possible, while following best practices. A View Source link takes you right to the code in GitHub. From Hello World to data access and third-party libraries, there is a recipe for that!

<div>
    <img src="https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70,w_50/learn/projects/quick-start-lwc-recipes-app/bb501c3216ac163958f036fb90357955_badge.png" align="left" alt="Trailhead Badge"/>
    Learn more about this app by completing the <a href="https://trailhead.salesforce.com/content/learn/projects/quick-start-lwc-recipes-app">Quick Start: Explore the LWC Recipes Sample App</a> Trailhead project.
    <br/>
    <br/>
    <br/>
</div>

> This sample application is designed to run on Salesforce Platform. If you want to experience Lightning Web Components on any platform, please visit https://lwc.dev, and try out our Lightning Web Components sample application [LWC Recipes OSS](https://github.com/trailheadapps/lwc-recipes-oss).

## Table of contents

-   [Installing the app using a Scratch Org](#installing-the-app-using-a-scratch-org): This is the recommended installation option. Use this option if you are a developer who wants to experience the app and the code.

-   [Installing the app using an Unlocked Package](#installing-the-app-using-an-unlocked-package): This option allows anybody to experience the sample app without installing a local development environment.

-   [Installing the app using a Developer Edition Org or a Trailhead Playground](#installing-the-app-using-a-developer-edition-org-or-a-trailhead-playground): Useful when tackling Trailhead Badges or if you want the app deployed to a more permanent environment than a Scratch org.

-   [Optional installation instructions](#optional-installation-instructions)

-   [Code tours](#code-tours)

## Installing the app using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub in your Trailhead Playground
    - Install Salesforce CLI
    - Install Visual Studio Code
    - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below):

    ```
    sfdx auth:web:login -d -a myhuborg
    ```

1. Clone the lwc-recipes repository:

    ```
    git clone https://github.com/trailheadapps/lwc-recipes
    cd lwc-recipes
    ```

1. Create a scratch org and provide it with an alias (**lwc-recipes** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a lwc-recipes
    ```

1. Push the app to your scratch org:

    ```
    sfdx force:source:push
    ```

1. Assign the **recipes** permission set to the default user:

    ```
    sfdx force:user:permset:assign -n recipes
    ```

1. Import sample data:

    ```
    sfdx force:data:tree:import -p ./data/data-plan.json
    ```

1. Open the scratch org:

    ```
    sfdx force:org:open
    ```

1. In **Setup**, under **Themes and Branding**, activate the **Recipes Lite** or **Recipes Blue** theme.

1. In App Launcher, click **View All** then select the **LWC** app.

## Installing the app using an Unlocked Package

Follow this set of instructions if you want to deploy the app to a more permanent environment than a Scratch org or if you don't want to install the local developement tools. You can use a non source-tracked orgs such as a free [Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/).

Make sure to start from a brand-new environment to avoid conflicts with previous work you may have done.

1. Log in to your org

1. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3t0000026EXCAA2) to install the Recipes unlocked package in your org.

1. Select **Install for All Users**

1. Import Account and Contacts data:

    - Click [here](https://raw.githubusercontent.com/trailheadapps/lwc-recipes/main/data/Accounts-Contacts.csv) to access the **Accounts-Contacts.csv** file. Right click on the browser window and save the file as **Accounts-Contacts.csv**.
    - In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
    - Click **Launch Wizard**.
    - Click **Accounts and Contacts**, and click **Add New Records**.
    - Drag the **Accounts-Contacts.csv** file you just saved to the upload area.
    - Click **Next**, **Next**, and **Start Import**.

1. If you're attempting the [Quick Start](https://trailhead.salesforce.com/en/content/learn/projects/quick-start-ebikes-sample-app) on Trailhead, this step is required, but otherwise, skip:

    - Go to **Setup > Users > Permission Sets**.
    - Click **recipes**.
    - Click **Manage Assignments**.
    - Check your user and click **Add Assignments**.

1. In **Setup**, under **Themes and Branding**, activate the **Recipes Lite** or **Recipes Blue** theme.

1. In App Launcher, click **View All** then select the **LWC** app.

## Installing the App using a Developer Edition Org or a Trailhead Playground

Follow this set of instructions if you want to deploy the app to a more permanent environment than a Scratch org.
This includes non source-tracked orgs such as a [free Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/).

Make sure to start from a brand-new environment to avoid conflicts with previous work you may have done.

1. Clone this repository:

    ```
    git clone https://github.com/trailheadapps/lwc-recipes
    cd lwc-recipes
    ```

1. Authorize your Trailhead Playground or Developer org and provide it with an alias (**mydevorg** in the command below):

    ```
    sfdx auth:web:login -s -a mydevorg
    ```

1. Run this command in a terminal to deploy the app.

    ```
    sfdx force:source:deploy -p force-app
    ```

1. Assign the `recipes` permission set to the default user.

    ```
    sfdx force:user:permset:assign -n recipes
    ```

1. Import some sample data.

    ```
    sfdx force:data:tree:import -p ./data/data-plan.json
    ```

1. If your org isn't already open, open it now:

    ```
    sfdx force:org:open -u mydevorg
    ```

1. In **Setup**, under **Themes and Branding**, activate the **Recipes Lite** or **Recipes Blue** theme.

1. In App Launcher, select the **LWC** app.

## Optional Installation Instructions

This repository contains several files that are relevant if you want to integrate modern web development tooling to your Salesforce development processes, or to your continuous integration/continuous deployment processes.

### Code formatting

[Prettier](https://prettier.io/) is a code formatter used to ensure consistent formatting across your code base. To use Prettier with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) from the Visual Studio Code Marketplace. The [.prettierignore](/.prettierignore) and [.prettierrc](/.prettierrc) files are provided as part of this repository to control the behavior of the Prettier formatter.

### Code linting

[ESLint](https://eslint.org/) is a popular JavaScript linting tool used to identify stylistic errors and erroneous constructs. To use ESLint with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-lwc) from the Visual Studio Code Marketplace. The [.eslintignore](/.eslintignore) file is provided as part of this repository to exclude specific files from the linting process in the context of Lightning Web Components development.

### Pre-commit hook

This repository also comes with a [package.json](./package.json) file that makes it easy to set up a pre-commit hook that enforces code formatting and linting by running Prettier and ESLint every time you `git commit` changes.

To set up the formatting and linting pre-commit hook:

1. Install [Node.js](https://nodejs.org) if you haven't already done so
1. Run `npm install` in your project's root folder to install the ESLint and Prettier modules (Note: Mac users should verify that Xcode command line tools are installed before running this command.)

Prettier and ESLint will now run automatically every time you commit changes. The commit will fail if linting errors are detected. You can also run the formatting and linting from the command line using the following commands (check out [package.json](./package.json) for the full list):

```
npm run lint
npm run prettier
```

## Code Tours

Code Tours are guided walkthroughs that will help you understand the app code better. To be able to run them, install the [CodeTour VSCode extension](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour).
