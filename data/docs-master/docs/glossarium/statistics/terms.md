# Definitions for statistics

## Impression

Impression shows how many times users who visited the application saw stories, previews of stories, or scrolled to stories in the reader.

The feed in the application consists of **preview cards**.

<img src="/images/feed.png" alt="reader" width="500px"/>

After the user has seen the feed, they create as many impressions as there are previews in the visible part of the feed _( +4 in this example)_. When user slides through the feed and sees new previews they generate as many impressions as the number of previews they have seen.

### Reader

The **reader** is the story viewer itself.

<img src="/images/reader.png" alt="reader" width="500px"/>

When user slides through stories in the reader, they generate impressions for each new story they slide to.

It is enough for a user to see stories in any format for such coverage to be counted.

### Non-unique impressions

The user can see one story or its preview as many times as they want. For each such interaction, a non-unique impression is counted.

### Unique impressions

#### By day

In this case, if the user sees the story/preview for the second time in a day, the impression **will not** be counted. Only the first view of the day will be counted.

#### Total impressions

If the user has already seen a certain story/preview then viewing this story again **will not** be counted as a unique impression.

## Open

Opening stories from previews in the story feed, from any control element (like an external button which opens the story) or swiping to new stories in the reader will trigger the **open** event in the statistics.

## Read

The **read** event is triggered when a user watches all slides of the story.

## Click

The **click** event represents clicks on buttons in the story.

## CTR (Click-Through Rate)

This parameter represents the conversion rate from impressions to openings multiplied by 100%.

> **Attention!**<br/>
> If the story is only available through an external control element _(button, link, etc.)_, its CTR will always remain **100%**. The impression occurs at the same time as the story opening in this scenario.

## Read Conversion Rate

This parameter represents the conversion rate from openings to reads multiplied by 100%.

## Transition Conversion Rate

This parameter represents the conversion rate from openings to clicks multiplied by 100%.
