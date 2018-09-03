# JavaScript SDK Demo App

This demo uses the JavaScript SDK, a part of Optimizely's Full Stack 2.0 solution. It will walk you through:

1. The capabilities of Feature Management
2. How to put an in-development feature behind a Feature Flag
3. How to launch to users with a controlled Rollout
4. How to use a Feature Configuration
5. How to run a Feature Test
6. How to track business metrics

## Optimizely Full Stack 2.0 Overview

Optimizely Full Stack allows developers to leverage Feature Management and run experiments anywhere in code! The JavaScript SDK provides the core components and handles aspects like bucketing, which is used to designate users to a specific Feature Flag or experiment variation, conversion tracking, and reporting via Optimizely’s [Stats Engine](https://www.optimizely.com/statistics/).

* View the [JavaScript Getting Started Guide](http://developers.optimizely.com/server/getting-started/index.html?language=python)

* View the reference [documentation](http://developers.optimizely.com/server/reference/index.html?language=javascript).

* Latest [JavaScript SDK](https://github.com/optimizely/javascript-sdk)

## Demo App

This example app illustrates how an online retailer could developer a new feature behind a toggle, rollout it out gradually to more users and run an experiment on the new vs old experience by tracking a business metric.

Using the instructions below, you can run the app locally and mimic bucketing website visitors by entering unique user IDs into the input bar. For example, the user ID “Matt” would simulate a unique visitor and the SDK would determine whether the feature shold be shown. The bucket that is given to a specific unique visitor, such as Matt, will be deterministic. This means as long as the Optimizely conditions remain the same, Matt will always get the same experience.
 
<img src="https://github.com/optimizely/javascript-sdk-demo-app/blob/master/src/images/screenshot.png" width="450">

### Deploying the App
1. Login or create an [Optimizely Account](https://app.optimizely.com/signin).
2. Create a project via the Optimizely dashboard. [Instructions](http://developers.optimizely.com/server/getting-started/index.html?language=javascript)
3. Add a Feature with the key `sorting_enabled`. This will act as a toggle for our new feature. 
4. Add the Event Key `item_purchase`.
5. In `constants.js`, update the `datafileURL` field. This is found in the dashboard, under Settings -> Environments.
6. Install dependencies & run the application
```
$ npm install
$ npm start
```
6. You’re all set. View at: `http://localhost:8080`!

### Frontend Bundle

Instead of including the SDK on the page as a standalone JavaScript asset, we use webpack to bundle all of our source code and dependencies into a single bundle. This includes all of our application logic as well as experimentation logic, including the Optimizely SDK. See `webpack.config.js`, the webpack configuration file, for an example of how this can work.

Alternatively, you could use webpack to build two bundles: a standalone Optimizely SDK bundle that assigns a property to `window`, and your application bundle which would make references to the global Optimizely SDK client variable.

### Building the App

In this app, we are adding the ability to sort items by price or category. We are improving the user experience by adding the ability to sort items rather than displaying randomly on the page. To do so safely, we are building this new feature behind an Optimizely powered Feature Flag. This gives us the ability to gate access without code deployments.

First, we must initialize the Optimizely JavaScript SDK. `optimizely_manager.js` handles initializing the Optimizely client. To instantiate an Optimizely client you must pass in a [datafile](https://developers.optimizely.com/x/solutions/sdks/reference/?language=javascript#datafile). The datafile acts as a config file and represents the state of your Optimizely project. It contains information like the status of your features, experiments, configuration parameters and traffic allocation.

```
var datafile = await _getDatafile();
  return optimizely.createInstance({
    datafile: datafile
  });
```

The main component of this app is implementing a Feature Flag to gate the code for our new sorting feature. We will use the `isFeaturedEnabled` API, which given a userID determines if the feature should be shown. It will return a Boolean `true` or `false`.

```
const isSortingEnabled = optimizelyClientInstance.isFeatureEnabled(
      'sorting_enabled',
       userID);

if (isSortingEnabled) {
    // Display Feature
      _renderSortingDropdown();
    }
```

This same function, `isFeatureEnabled` also controls Rollouts and Feature Tests through the SDK's bucketing logic. This is helpful when rolling out the feature to larger audiences or running experiments. Read more about [SDK bucketing](https://help.optimizely.com/Build_Campaigns_and_Experiments/How_bucketing_works_in_Optimizely's_Full_Stack_SDKs) on the Optiverse.

At this point, you can toggle the Feature Flag on and off by flipping the switch in the Feature Flag settings, under Rollouts. 

Next, let's run a Feature Test on this feature to ensure it doesn't negatively affect business metrics, like online sales. In this experiment, half the users will be exposed to the original experience and the other will see our new sorting feature. Ideally, this feature should increase checkout rate. 

Additionally, through Feature Configuration, you can set and manage variables in the Optimizely dashboard that can be accessed in code through the Optimizely object. In our case, let's dynamically change the welcome message using `getFeatureVariableString`. This function will return the corresponding string based on the user's bucket. To add this, return to the sorting_enabled Feature in the Optimizely dashboard. Add a variable under Feature Configuration. Name the Variable Key `welcome_message` and use type String. The code looks like:

```
const welcomeMessage = optimizelyClientInstance.getFeatureVariableString(
      'sorting_enabled',
      'welcome_message',
      userID,
    );

if (welcomeMessage) {
    $('#welcome').html(welcomeMessage);
}

```

To complete this Feature Test, we must track a metric. Let's track button clicks to "Buy Now", as we want to ensure this feature encourages users to buy items. We've added an onClick handler to the HTML button that triggers a call to Optimizely's `.track()` function. 

`optimizelyClientInstance.track('item_purchase', userID);`

Before we can test it locally, we need to create the experiment in the Optimizely dashboard. Create a new Feature Test using the Feature `sorting_enabled`. Let's create two variations with a 50/50 split. Only one variation should enabled our sorting feature. Next, we should see the previously added Feature Config variable `welcome_message`. Now we can add text for each experience ON/OFF. Lastly, add a new event with the Event Key `item_purchase`. The datafile will now update and upload these new configurations to the CDN. After a few minutues, try simulating visitors in the experiment using the input bar. Also, try clicking the Buy Now button to simulate a coversion event. Within a few seconds, you should see the results populate on the Optimizely results page.


## Getting Help! 

* Developer Docs: https://developers.optimizely.com/x/solutions/sdks/
* Questions? Shoot us an email at developers@optimizely.com
