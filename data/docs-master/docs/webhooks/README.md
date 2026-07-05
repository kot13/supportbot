# Webhooks

## Request format

Data sending is performed via POST-request to the url adress specified in options. The payload is sent via JSON in
request body.
For additional security `X-signature` header is sent, which contains the HMAC SHA256 request body signature based on a
secret key in the options.

All events contain following fields:

| Parameter    | Description                                  |
|--------------|----------------------------------------------|
| event_id     | Unique event identifier, 32 character string |
| event_name   | Name of an event                             |
| timestamp_ms | Time of creation in milliseconds             |

Other fields depend on the type

In case of successful event handling the client must send a response containing `HTTP status code 2xx`, otherwise the
the attempts to send data will persist.

## Story statuses

| Value | Description                              |
|-------|------------------------------------------|
| 0     | Draft, currently in work by another user |
| 1     | Published                                |
| 2     | Deleted                                  |
| 3     | Archived                                 |
| 4     | In moderation                            |
| 5     | Approved                                 |
| 6     | Declined                                 |

## Events

### Story status change

Appears after any change of story's status.

**event_name:** story-status-changed

| Parameter               | Description                                                                   |
|-------------------------|-------------------------------------------------------------------------------|
| story                   | Object, contains story data                                                   |
| story.id                | Story's unique number identifier                                              |
| story.status            | Current story status                                                          |
| story.title             | Story title                                                                   |
| story.displayFrom       | Timestamp of the story display start UNIX TIMESTAMP<br/><i>uint32 or NULL</i> |
| story.displayTo         | Timestamp of the story display end UNIX TIMESTAMP<br/><i>uint32 or NULL</i>   |
| story.expression        | Story display conditions<br/><i>String or NULL</i>                            |
| changes                 | Information about changes                                                     |
| changes.status          | Changed field                                                                 |
| changes.status.previous | Previous story status                                                         |
| changes.status.current  | Current story status                                                          |

**Notification example**

```JSON
{
  "story": {
    "id": 6496,
    "status": 5,
    "title": "story #6496"
  },
  "changes": {
    "status": {
      "previous": 6,
      "current": 5
    }
  },
  "event_id": "8k7SdBMz6KPGhC3S4e4ZpMlm4c1U8p9v",
  "event_name": "story-status-changed",
  "timestamp_ms": 1655728818761
}
```

## UGC story moderation

**event_name:** ugc-story-moderation

| Parameter               | Type             | Description                             |
|-------------------------|------------------|-----------------------------------------|
| ugcStory                | object           | Object containing story information     |
| ugcStory.id             | unsigned integer | Story's unique number identifier        |
| ugcStory.status         | unsigned integer | Current story status                    |
| ugcStory.externalUserId | string or null   | Unique user identifier in partner's app |
| ugcStory.payload        | dynamic object   | Object containing additional story data |
| ugcStory.hasVideo       | boolean          | Has video flag                          |

**Notification example**

```JSON
{
  "ugcStory": {
    "id": 12,
    "status": 6,
    "externalUserId": "ext-10",
    "hasVideo": false,
    "payload": {
      "prop1": "alpha",
      "prop2": "omega"
    }
  },
  "event_id": "8k7SdBMz6KPGhC3S4e4ZpMlm4c1U8p9v",
  "event_name": "ugc-story-moderation",
  "timestamp_ms": 1655728818761
}
```

## UGC Story approval

**event_name:** ugc-story-approve

| Parameter               | Type             | Description                             |
|-------------------------|------------------|-----------------------------------------|
| ugcStory                | object           | Object containing story information     |
| ugcStory.id             | unsigned integer | Story's unique number identifier        |
| ugcStory.status         | unsigned integer | Current story status                    |
| ugcStory.externalUserId | string or null   | Unique user identifier in partner's app |
| ugcStory.payload        | dynamic object   | Object containing additional story data |
| ugcStory.comment        | string or null   | Commentary                              |
| ugcStory.hasVideo       | boolean          | Has video flag                          |

**Notification example**

```JSON
{
  "ugcStory": {
    "id": 12,
    "status": 5,
    "externalUserId": "ext-10",
    "comment": null,
    "hasVideo": false,
    "payload": {
      "prop1": "alpha",
      "prop2": "omega"
    }
  },
  "event_id": "8k7SdBMz6KPGhC3S4e4ZpMlm4c1U8p9v",
  "event_name": "ugc-story-approve",
  "timestamp_ms": 1655728818761
}
```

## UGC Story declination

**event_name:** ugc-story-decline

| Parameter               | Type             | Description                             |
|-------------------------|------------------|-----------------------------------------|
| ugcStory                | object           | Object containing story information     |
| ugcStory.id             | unsigned integer | Story's unique number identifier        |
| ugcStory.status         | unsigned integer | Current story status                    |
| ugcStory.externalUserId | string or null   | Unique user identifier in partner's app |
| ugcStory.payload        | dynamic object   | Object containing additional story data |
| ugcStory.comment        | string or null   | Commentary                              |
| ugcStory.hasVideo       | boolean          | Has video flag                          |

**Notification example**

```JSON
{
  "ugcStory": {
    "id": 12,
    "status": 6,
    "externalUserId": "ext-10",
    "comment": "comment text place",
    "hasVideo": false,
    "payload": {
      "prop1": "alpha",
      "prop2": "omega"
    }
  },
  "event_id": "8k7SdBMz6KPGhC3S4e4ZpMlm4c1U8p9v",
  "event_name": "ugc-story-decline",
  "timestamp_ms": 1655728818761
}
```

## Game webhook

**General parameters**

| Parameter           | Type             | Description                                  |
|---------------------|------------------|----------------------------------------------|
| game                | object           | Object containing game information           |
| game.id             | unsigned integer | Unique game number identifier                |
| game.game           | string           | Game name                                    |
| user                | object           | Object containing user information           |
| user.externalUserId | string or null   | Unique user identifier in partner's app      |
| payload             | dynamic object   | Additional game info. Will vary game to game |
| event_id            | string           | Generated event id                           |
| event_name          | string           | Name of the fired event                      |
| timestamp_ms        | unsigned integer | Timestamp of event in milliseconds           |

### Payload examples
* [Fifteen puzzle](#fifteen-puzzle)
* [Wheel of fortune](#wheel-of-fortune)
* [Memories](#memories)
* [Advent calendar](#advent-calendar)
* [Slicer](#slicer)
* [Sorting](#sorting)
* [Match three](#match-three)
* [Mystery boxes](#mystery-boxes)
* [Shaker](#shaker)

### Fifteen puzzle:

| Parameter | Type             | Description                       |
|-----------|------------------|-----------------------------------|
| tryId     | unsigned integer | Unique try id                     |
| type      | string           | Game result type: "win" or "lose" |
| duration  | unsigned integer | Game duration                     |
| moves     | unsigned integer | Moves count                       |

**Notification example**
```json
{
  "game": {
    "id": 2893,
    "game": "boxed-fifteen"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98841037,
    "type": "win",
    "duration": 13,
    "moves": 5
  },
  "event_id": "0QoSbrTxxwB7pMReUm7BTYWCQnYRKWx1",
  "event_name": "game-end",
  "timestamp_ms": 1771239460714
}
```

### Wheel of fortune:

| Parameter   | Type             | Description                                             |
|-------------|------------------|---------------------------------------------------------|
| tryId       | unsigned integer | Unique try id                                           |
| sectorIndex | unsigned integer | Index of sector(starts from 0) created in game settings |

**Notification example**

```json
{
  "game": {
    "id": 3159,
    "game": "boxed-wheel"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98841070,
    "sectorIndex": 6
  },
  "event_id": "4HskAiRNkNQ9cHSCGUDzRJ5M1jSNs1YQ",
  "event_name": "game-end",
  "timestamp_ms": 1771239493236
}
```

### Memories:

| Parameter | Type             | Description                       |
|-----------|------------------|-----------------------------------|
| tryId     | unsigned integer | Unique try id                     |
| type      | string           | Game result type: "win" or "lose" |
| duration  | unsigned integer | Game duration                     |
| moves     | unsigned integer | Moves count                       |

**Notification example**

```json
{
  "game": {
    "id": 3092,
    "game": "boxed-memory"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98841151,
    "type": "lose",
    "duration": 18,
    "moves": 6
  },
  "event_id": "yJohAcWH5iAnrzphEI1F_JwbSHdobJzY",
  "event_name": "game-end",
  "timestamp_ms": 1771239624581
}
```

### Advent calendar:

| Parameter  | Type             | Description                                   |
|------------|------------------|-----------------------------------------------|
| tryId      | unsigned integer | Unique try id (always 0 in Advent)            |
| index      | unsigned integer | Opened card index (starts from 0)             |
| isBonus    | boolean          | Indication that this screen is a bonus screen |

**Notification example**

```json
{
  "game": {
    "id": 3013,
    "game": "boxed-advent-calendar"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 0,
    "index": 0,
    "isBonus": false
  },
  "event_id": "We8rxJSFy8tR6xDX4IOK5efm7h9F6R3C",
  "event_name": "game-end",
  "timestamp_ms": 1771239677306
}
```

### Slicer:

| Parameter | Type             | Description   |
|-----------|------------------|---------------|
| tryId     | unsigned integer | Unique try id |
| duration  | unsigned integer | Game duration |
| score     | unsigned integer | User score    |

**Notification example**

```json
{
  "game": {
    "id": 2631,
    "game": "boxed-slicer"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98841371,
    "score": 0,
    "duration": 14
  },
  "event_id": "sPj6BT4saU1J9quVZwK5hOpflRxT7XvI",
  "event_name": "game-end",
  "timestamp_ms": 1771239819759
}
```

### Sorting:

| Parameter | Type             | Description                       |
|-----------|------------------|-----------------------------------|
| tryId     | unsigned integer | Unique try id                     |
| type      | string           | Game result type: "win" or "lose" |
| duration  | unsigned integer | Game duration                     |
| level     | unsigned integer | Game level                        |

**Notification example**

```json
{
  "game": {
    "id": 3120,
    "game": "boxed-sorting"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98841426,
    "type": "win",
    "duration": 4,
    "level": 1
  },
  "event_id": "DvqB3qzk0Ta34nSzBUJo-L5X9FNhD8z3",
  "event_name": "game-end",
  "timestamp_ms": 1771239859099
}
```

### Match three:

| Parameter | Type             | Description   |
|-----------|------------------|---------------|
| tryId     | unsigned integer | Unique try id |
| duration  | unsigned integer | Game duration |
| score     | unsigned integer | Game score    |

**Notification example**
```json
{
  "game": {
    "id": 3157,
    "game": "boxed-match-3"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98841541,
    "score": 12,
    "duration": 19
  },
  "event_id": "ic-eb5mx351j6jaJN_HxjupHLkhOzFaE",
  "event_name": "game-end",
  "timestamp_ms": 1771239978287
}
```

### Mystery boxes:

| Parameter | Type             | Description                                                       |
|-----------|------------------|-------------------------------------------------------------------|
| tryId     | unsigned integer | Unique try id                                                     |
| index     | unsigned integer | Opened item index on the field (starts from 0)                                  |
| itemType  | string           | Opened item type: "win", "lose", "empty", "prize" or "extra_move" |

**Notification example**
```json
{
  "game": {
    "id": 739,
    "game": "lootbox"
  },
  "user": {
    "internalUserId": 20885962,
    "externalUserId": "569",
    "deviceId": null
  },
  "payload": {
    "tryId": 476926,
    "index": 4,
    "itemType": "empty"
  },
  "event_id": "1I3ZECkbYDvadAoGEfoV34Sg0i93Yq7z",
  "event_name": "game-end",
  "timestamp_ms": 1774624149410
}
```

### Shaker:

| Parameter | Type             | Description                      |
|-----------|------------------|----------------------------------|
| tryId     | unsigned integer | Unique try id                    |
| count     | unsigned integer | Hit count                        |
| duration  | unsigned integer | Game duration                    |
| itemIndex | unsigned integer | Opened item index(starts from 0) |

**Notification example**

```json
{
  "game": {
    "id": 3095,
    "game": "boxed-shaker"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98515524,
    "count": 60,
    "duration": 3,
    "itemIndex": 3
  },
  "event_id": "fRZKOiZ0IO4ed0xXnw4LF-QTahIFvV7-",
  "event_name": "game-end",
  "timestamp_ms": 1770813507585
}
```

### Words

| Parameter | Type             | Description                      |
|-----------|------------------|----------------------------------|
| tryId     | unsigned integer | Unique try id                    |
|  type     | string           | Game result type: "win" or "lose"|
| duration  | unsigned integer | Game duration                    |
| level     | unsigned integer | Game level                       |

**Notification example**

```json
{
  "game": {
    "id": 3130,
    "game": "boxed-words"
  },
  "user": {
    "internalUserId": 395582092,
    "externalUserId": "1929",
    "deviceId": null
  },
  "payload": {
    "tryId": 98888616,
    "type": "win",
    "duration": 25,
    "level": 1
  },
  "event_id": "dln7eAb46ZRCad1E8imcVgz2WGEqq_rk",
  "event_name": "game-end",
  "timestamp_ms": 1771317902901
}
```

## Promocode webhook

**event_name:** promo-code-user-allocated

| Параметр	            | Тип              | Описание                                                                |
|----------------------|------------------|-------------------------------------------------------------------------|
| promoCode	           | object           | Object containing information about the promocode                                |
| promoCode.id	        | unsigned integer | Unique numerical identifier for a group of promo codes                     |
| promoCode.name	      | string           | Text name of the promocode group                                    |
| promoCode.code	      | string           | Promocode value                                                      |
| user	                | object           | Object containing information about the user                             |
| user.internalUserId	 | unsigned integer | Internal unique user identifier                        |
| user.externalUserId	 | string or null   | Unique user identifier transmitted via UserID         |
| user.deviceId	       | string or null   | Unique device identifier, if UserID was not transmitted |

**Notification example**
```JSON
{
  "promoCode": {
    "id": 12,
    "name": "New Year Promotion 2025",
    "code": "1234567890"
  },
  "user": {
    "internalUserId": 4564465784,
    "externalUserId": "ext-10",
    "deviceId": null
  },
  "event_id": "8k7SdBMz6KPGhC3S4e4ZpMlm4c1U8p9v",
  "event_name": "promo-code-user-allocated",
  "timestamp_ms": 1655728818761
}
```
