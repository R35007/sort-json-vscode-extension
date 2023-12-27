# Sort JSON

Simple JSON Object and Array sort.

<img style="max-width: 2000px;" width="90%" src="https://user-images.githubusercontent.com/23217228/206927500-6b5202ff-f06f-4b2c-8fd2-7a218ff5005a.gif">

## Features

- Sort JSON with comments.
- Sort Ascending
- Sort Descending
- Sort Randomize
- Sort By Value
- Sort By Key
- Sort By Value Length
- Sort By Key Length
- Sort By Value Type
- Sort By Custom Comparison.
- Sort Object
- Sort List items
- Sort Collections
- Also supports Quick Fix and Fix All code action

## Custom Sort

- Right click on a file and select `Do Custom Sort` command from `Sort JSON`.
- A quick pick items shows up where we can provide our own custom logic to sort the data.
- We can also save our custom comparisons in settings using `sort-json.settings.customComparisons` vscode settings which will shows up in the quick pick items.
- Please use conditional operators to sort with multiple conditions.

`Sort Array`

- predefined variables
  - `item1`, `key1`, `val1`, `value1`, `x` is equal to `a`.
  - `item2`, `key2`, `val2`, `value2`, `y` is equal to `b`.
  - `_`, `lodash`, `dash` - Lodash is exposed.
- Checks
  - `isArray`, `isList` will be `true` in array sort order
  - `isObject` will be `false` in array sort order
  - `isAllNumber` - returns `true` if all the items in a list are numbers
  - `isAllString` - returns `true` if all the items in a list are string
  - `isAllList` - returns `true` if all the items in a list are list
  - `isAllObject`, `isCollection` - returns `true` if all the items in a list are objects
- examples:

  ```jsonc
  // sort ascending
  [ 9,2,6,5,4,1,3,0,7 ]
  // comparison code = a - b or item1 - item2 or x - y etc...
  // sort to  [ 0, 1, 2, 3, 4, 5, 6, 7, 9 ]

  // sort by item length
  [ "Hi", "this", "is", "a", "custom", "comparison", "sort" ]
  // comparison code = item1.length - item2.length
  // sort to  [ "a", "Hi", "is", "this", "sort", "custom", "comparison" ]

  // sort by alphabetical case in-sensitive ascending
  [ "Hi", "this", "is", "a", "custom", "comparison", "sort" ]
  // comparison code = _.toLower(a) == _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1
  // sort to  [ "a", "comparison", "custom", "Hi", "is", "sort", "this" ]

  // sort collections by id
  [ { "id": 2, "name": "bar" }, { "id": 1, "name": "foo" } ]
  // comparison code = a.id - b.id
  // sort to  [ { "id": 1, "name": "foo" }, { "id": 2, "name": "bar" } ]

  // sort collections by name
  [ { "id": 1, "name": "foo" }, { "id": 2, "name": "bar" } ]
  // comparison code = a.name == b.name ? 0 : a.name > b.name ? 1 : -1
  // sort to  [ { "id": 1, "name": "foo" }, { "id": 2, "name": "bar" } ]
  ```

`Sort Object`

- predefined variables
  - `key1` - Object first key
  - `key2` - Object second key
  - `val1`, `value1` - Object first value
  - `val2`, `value2` - Object second value
  - `item1` - { key: `key1`, val: `val1` }
  - `item2` - { key: `key2`, val: `val2` }
  - `a`, `x` is equal to `item1`
  - `b`, `y` is equal to `item2`
  - `_`, `lodash`, `dash` - Lodash is exposed.
- Checks

  - `isArray`, `isList` will be `false` in object sort order
  - `isObject` will be `true` in object sort order
  - `isAllNumber` - returns `true` if all the values in a object are numbers
  - `isAllString` - returns `true` if all the values in a object are string
  - `isAllList` - returns `true` if all the values in a object are list
  - `isAllObject`, `isCollection` - returns `true` if all the values in a list are objects

- examples:

  ```jsonc
  // sort by key length
  { "name": "first item", "id": 1, "label": "foo" }
  // comparison code = key1.length - key2.length or item1.key.length - item2.key.length
  // sort to  { "id": 1, "name": "first item", "label": "foo" }

  // sort by value length
  { "name": "foo", "id": 1, "label": "first item" }
  // comparison code = isAllString ? val1.length - val2.length : true
  // sort to  { "id": 1, "label": "foo", "name": "first item" }
  ```

## Sort on save

There's a vscode setting for formatters (settings.json):

````json
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit" // set to "explicit" to sort json files on save
  }
```

But you can also selectively enable/disable this formatter with (settings.json):

```jsonc
{
    "editor.codeActionsOnSave": {
        "source.fixAll.sort-json": "never" // set to "explicit" to sort json files on save. set to "never" to stop sorting on save
    }
}
```

Or use a hotkey, if you prefer (keybindings.json):

```json
{
    "key": "cmd+shift+a",
    "command": "editor.action.codeAction",
    "args": {
        "kind": "source.fixAll.sort-json"
    }
}
```

**Enjoy!**
````
