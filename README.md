# Optimizely Android SDK Getting Started

Optimizely X Full Stack is an A/B testing and feature management platform for product development teams. This guide enables you to quickly get started in your development efforts to consume the Optimizely SDK using Javascript. For a functional sample web application demonstratig how to use SDK, see the [Javascript Demo App](https://github.com/optimizely/javascript-sdk-demo-app) package.

For additonal information see the Full Stack [documentation](https://docs.developers.optimizely.com/full-stack/docs).

## Packages
This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). Note that only one package lives here currently, but that may change in the future.

| Package                                                | Version                                                                                                                                   | Docs                                                                                                                                                                                                                                                                          | Description                                                                        |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`@optimizely/optimizely-sdk`](/packages/optimizely-sdk) | [![npm](https://img.shields.io/npm/v/%40optimizely%2Foptimizely-sdk.svg)](https://www.npmjs.com/package/@optimizely/optimizely-sdk)     | [![](https://img.shields.io/badge/API%20Docs-site-green.svg?style=flat-square)](https://developers.optimizely.com/x/solutions/sdks/reference/?language=javascript)           | The Optimizely SDK  

The table provides two links:
* The link in the **Package** column takes you direct to the SDK subpackage here on Github.
* The link in the **Version** column points to the NPM site where the node.js version is located.

## Consuming the API

The following steps illustrate the main calls you will need to make to consume the API.

## 1. Get the Data File
A [data file](https://docs.developers.optimizely.com/full-stack/docs/get-the-datafile) contains information about your experiments' configurations. The file is hosted by Optimizely and the URL is available from your Optimizely dashboard under **Settings** > **Environments**. The following example demonstrates how to obtain this file from client code:

```javascript
require('es6-promise').polyfill();
require('isomorphic-fetch');

const datafileURL = 'https://mytest.optimizely.com/datafiles/626QeFJN....json';
var datafile = await fetch(datafileURL)
                          .then(function (response) {
                            if (response.status >= 400) {
                              console.log('Error downloading datafile');
                            }
                            return response.json();
                          });
```

## 2. Instantiate a Client
An Optimizely client object contains all of the methods to build and run experiments. It's constructed by invoking the `createInstance` method and passing in a config object that points to the data from the datafile read in the previous step:
```javascript
var optimizely = require('@optimizely/optimizely-sdk');
var logger = require('@optimizely/optimizely-sdk/lib/plugins/logger');
var enums = require('@optimizely/optimizely-sdk/lib/utils/enums');


var optlyInstance = optimizely.createInstance({
      datafile: datafile,
      logger: logger.createLogger({
        logLevel: enums.LOG_LEVEL.DEBUG,
      }),
    });
```

## 3. Query Feature Flags
The Optimizely client object's methods are then used to gather information about experiments. The following example shows client code querying the Optimizely client to obtain the enabled status of a feature and a feature variable for a given user:
```javascript
const isSortingEnabled = optlyInstance.isFeatureEnabled(
    'sorting_enabled',
    `User1`,
);

const welcomeMessage = optlyInstance.getFeatureVariableString(
    'sorting_enabled',
    'welcome_message',
    `User1`,
);
```

## 4. Run a Feature Test
The Optimizely client's `activate` method is used to [activate](https://docs.developers.optimizely.com/full-stack/docs/activate) (start) a feature test for a given user and returns a `Variation` object that your client code can use to make decisions about what code to execute for a variation:
```javascript
// Activate an A/B test
var variation = optlyInstance.activate('testExperiment', 'testUser');
if (variation != null) {
  if (variation.is("control")) {
    // Execute code for "control" variation
  } else if (variation.is("treatment")) {
    // Execute code for "treatment" variation
  }
} else {
  // Execute code for users who don't qualify for the experiment
}
```

## 5. Track an Event
The final step is to [track](https://docs.developers.optimizely.com/full-stack/docs/track) events by invoking the `track` method. The tracked events can be viewed in your Optimizely dashboard. 

The `track` method takes in an event key representing the event to track which was provided when the Optimizely app was created. It also takes in the ID of the user to track events on, and optional attributes consisting of key/value pairs to include as part of the tracked data:
```javascript
// Track a conversion event for the provided user with attributes
optimizelyClientInstance.track('item_purchase', "User1");
```
## About

`@optimizely/optimizely-sdk` is developed and maintained by [Optimizely](https://optimizely.com) and many [contributors](https://github.com/optimizely/javascript-sdk/graphs/contributors). If you're interested in learning more about what Optimizely X Full Stack can do for your company, please [get in touch](mailto:eng@optimizely.com)!


### Contributing

Please see [CONTRIBUTING](./CONTRIBUTING.md).


