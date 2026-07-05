# Gathering Statistics

InAppStory offers a variety of methods for collecting and processing statistical data.

## By Days

To collect general statistics, follow these steps:

1. Go to the **Stats** section in the left menu of the InAppStory console.
2. Select **By Days**.
3. Choose the desired time period, platform, and uniqueness.
4. Click **Export** and select the file type (XLSX, CSV).
5. The report will be downloaded in your browser window.

## By Stories

"By Stories" statistics can be collected in the same way as "By Days" but in the "By Stories" section of **Stats**.

### By Users

It is possible to collect user interactions with a particular story. Follow these steps:

1. Go to the **Stats** section in the left menu of the InAppStory console.
2. Select **By Stories**.
3. Choose the desired story.
4. Click **Export** and under the **"By User"** section, click **CSV**.
5. Click **Create a New Report** in the newly appeared window.
6. Wait until the report status becomes **Successful** and download it.

> **Attention!** <br/>
> 4th step is possible only with single story statistics.

## By Widgets

You can collect widget interaction data. Each widget collects its own set of data, so you will have to collect this data individually from each widget if you didn't automate this process.

To learn how to make automations for statistics, click [here](#automation).

To download widget statistics, follow these steps:

1. Go to the **Stats** section in the left menu of the InAppStory console;
2. Select **By stories**;
3. Pick a desired story;
4. Pick the **Widget** view;

![](/images/widget.png)

5. Pick a desired widget and press **Download**;
6. Press **Create a new report** in the newly appeared window;
7. Wait until the report status becomes **Successful** and download it.

### Encoding issues

You may encounter encoding issues if your device uses other encoding systems.

To resolve this issue, follow [this guide](https://console.domain-placeholder/docs/CSV-to-excel).

## Automation

There are some ways to automate the creation of stat reports with the use of **InAppStory API methods** and **in-app events**. They allow you to create stat reports programmatically and to collect data.

### REST API

InAppStory REST API has a number of methods for collecting statistics.

1. [Collect summary stats for a story](https://api.domain-placeholder/pub/v1#/operations/f669f7397fbb3b9b407e2499949bdced);
2. [Collect stats by days for a story](https://api.domain-placeholder/pub/v1#/operations/f669f7397fbb3b9b407e2499949bdced);
3. [Get a list of already generated reports for a story](https://api.domain-placeholder/pub/v1#/operations/f6e5a7eb8734b6f597f973924a1cfbad);
4. [Generate a new report for the story](https://api.domain-placeholder/pub/v1#/operations/f2a4cdb6db28acdcc45d25c8753b5ab1);
5. [View the status of a report by its ID](https://api.domain-placeholder/pub/v1#/operations/fc8f66f6620912619b62589a78d8b563);
6. [Get a list of already generated reports for a widget](https://api.domain-placeholder/pub/v1#/operations/f70efb94b6fcad486853dd3b30ded230);
7. [Generate a new report for the widget](https://api.domain-placeholder/pub/v1#/operations/7b8e83713d59c56b3810f87c059cbd96);
8. [View the status of a report by its ID](https://api.domain-placeholder/pub/v1#/operations/d2e1c67db06b19f59395b4bcf5d42f60).

You can use these methods to configure your own statistics collection.

:::warning
Using InAppStory REST API has a number of restrictions and is considered to be a slower method among the two. The main restriction being the necessity to **download** statistic reports in the .csv format.
We recommend using the next method as it allows great flexibility and requires less time and effort in development.
:::

### In-app events

With the use of in-app events, you can collect statistics in real time, allowing you to customize statistics gathering fully to your taste.
To use this functionality you will need to use **events** programmatically.

:::tip
This method is more preferable than all of the above as it gives an opportunity to fine-tune the needed data, the time and place of data collection, and the method itself is the most customizable among others.
:::

Once you subscribe to events, every time that event is fired, you will have access to information about the event that occurred (shown story id, tags, slide info, game info, pushed button data and more).

The partner will presumably collect and then push the data to some external data storage.
The application is expected to convert the received data to the correct storage format.

![](/images/in-app-events.png)

Here are the guides for each platform on how to implement this functionality in your code:

1. [Android](../../sdk-guides/android/events.md);
2. [iOS](../../sdk-guides/ios/events.md);
3. [JS](../../sdk-guides/js-sdk/events.md);
4. [React-Native](../../sdk-guides/react-native/events.md);
5. [React](../../sdk-guides/react-sdk/events.md);
6. [Flutter](../../sdk-guides/flutter/events.md);
