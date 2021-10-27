# node-bubbleio

[![NPM](https://img.shields.io/npm/v/node-bubbleio.svg)](https://www.npmjs.com/package/node-bubbleio)

__Bubble.io Data and Workflow API client for node.js__

_This package is in active development and only supports Data API endpoints right now_

## Installation & Setup

### Install

```bash
npm i node-bubbleio --save
```

### Define your Things

Each Data API endpoint needs to be defined as its own class:

```js
const BubbleIO = require('node-bubbleio');

class Thing extends BubbleIO.DataAPI {
  _type = 'thing'; // This is the object name
}
```

__In Typescript, you also pass in the custom attributes of your thing__

```typescript
class Thing extends BubbleIO.DataAPI {
  _type = 'thing';

  title_text: string;
}
```

### Configuration

- __apiToken__: Your API token
- __domain__: Full domain to your API (_include `.bubbleapps.io` if not using a custom domain_)
- __isLive__: Whether to use the live version of your API

You can set these by passing values into `BubbleIO.init`:

```js
BubbleIO.init({
  domain: 'my-amazing-app.bubbleapps.io',
  apiToken: 'a6se92a9dd6cb69979128a6969c98c89'
});
```

Or you can set these via environment variables and just run `BubbleIO.init`:

```
//.env
BUBBLE_DOMAIN=my-amazing-app.bubbleapps.io
BUBBLE_API_TOKEN=a6se92a9dd6cb69979128a6969c98c89
BUBBLE_LIVE=false
```

```js
BubbleIO.init()
```

## Usage

### Retrieve a thing by ID

If you already know the ID of a thing, you can get the thing from the server using the static `get` method:

```js
const thing = await Thing.get('1449154312665x293260311940684900');
```

### Modify a thing

After creating or getting a thing, you can edit the thing directly and then save your changes using the `save` method:

```js
thing.title_text = 'My new thing';
await thing.save()
```

The original `thing` in your code will be updated with the latest version from the API. For example, the `Modified Date` will be up to date.

### Delete a thing

To delete a thing use `delete` method:

```js
await thing.delete()
```

### Create a new thing

To create a thing, you can use the static `create` method:

```js
const newThing = await Thing.create({
  title_text: 'My new thing'
});
```

Or you can create a new thing and use the `save` method:

```js
const newThing = new Thing({
  title_text: 'My new thing'
})
await newThing.save();
```

`newThing` will have all the updated fields from the Data API like `_id` and `Created Date`.

### Bulk create things

If you need to create many new things in a single operation, you can do that using the `bulkCreate` method:

```js
const newThings = await Thing.bulkCreate([{
  title_text: 'Thing 1'
}, {
  title_text: 'Thing 2'
}]);
console.log(newThings[0].title_text) // Thing 1
```

This will return an array of things.

### Getting a list of things and search

To retrieve a list of things, optionally using search constraints, use the `find` method:

```js
const found = await Thing.find({
  constraints: [
    {
      key: 'title_text',
      constraint_type: 'text contains',
      value: 'Test',
    },
  ],
  limit: 1,
  cursor: 2,
  sort_field: 'Created Date',
  descending: true
});
```

This method supports all [pagination](https://manual.bubble.io/core-resources/api/data-api#pagination), [search constraints](https://manual.bubble.io/core-resources/api/data-api#search-constraints), and [sorting options](https://manual.bubble.io/core-resources/api/data-api#sorting-options).

## License
[MIT](https://oss.ninja/mit?organization=Curtis%20Cummings)
