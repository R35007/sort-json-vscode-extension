# Sort JSON

Simple JSON Object and Array sort.

<img style="max-width: 2000px;" width="90%" src="https://user-images.githubusercontent.com/23217228/206927500-6b5202ff-f06f-4b2c-8fd2-7a218ff5005a.gif">

<a href="https://buymeacoffee.com/r35007" target="_blank">
  <img src="https://r35007.github.io/Siva_Profile/images//buymeacoffee.png" />
</a>

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
- Sort Collections (Array of object) by its key
- Override object sort key order
- Sort by case sensitive and insensitive
- Set Nested Sort level
- Sort Partially selected json text 
- Also supports Quick Fix and Fix All code action

## Configuration Settings

1. **sort-json.settings.sortMode**: Set the sort mode for JSON. Options: ["Both", "Lists Only", "Objects Only"]. Default: "Both".
2. **sort-json.settings.sortLevel**: Set the depth of sorting. Options: [-1, 1, 0]. Default: -1.
3. **sort-json.settings.objectSortType**: Set the sorting type for JSON objects. Options: ["Key", "Key Length", "Value", "Value Length", "Value Type"]. Default: "Key".
4. **sort-json.settings.listSortType**: Set the sorting type for JSON lists. Options: ["Value", "Value Length", "Value Type"]. Default: "Value".
5. **sort-json.settings.sortValueTypeOrder**: Set the order of value types to sort. Options: ["Boolean", "Null", "Number", "String", "Array", "Collection", "PlainObject"].
6. **sort-json.settings.isCaseSensitive**: Set to compare with case sensitivity in sorting. Options: [True, False]. Default: False.
7. **sort-json.settings.promptCollectionKeys**: Prompt to select keys to sort a collection. Options: [True, False]. Default: True.
8. **sort-json.settings.preserveUnicodeString**: Set to preserve Unicode strings in sorting. Options: [True, False]. Default: False.
9. **sort-json.settings.orderOverrideKeys**: Keys to override the sort order. Default: []. Provide keys with a spread ('...') to place remaining object keys in order.
10. **sort-json.settings.excludePaths**: Set exclude paths for deep sort. Default: []. Provide paths as strings.
11. **sort-json.settings.customSortComparisons**: Provide custom sort comparison codes. Default: []. Provide an array of objects with "comparison" and "description" fields.
12. **sort-json.settings.defaultCustomSort**: Provide default custom sort comparison code. Default: "". Provide a string for default custom comparison.
13. **sort-json.settings.contextMenu**: Show or hide Sort JSON context menus. Default:
    ```json
    {
      "sortJsonSubMenu": true,
      "ascendingSort": false,
      "descendingSort": false,
      "randomizeSort": false,
      "customSort": false,
      "setSortLevel": false,
      "setObjectSortType": false,
      "setListSortType": false,
      "isCaseSensitive": false,
      "promptCollectionKeys": false
    }
    ```
14. **sort-json.settings.showInfoMsg**: Show or hide information messages. Options: [True, False]. Default: True.
15. **sort-json.settings.ignoreFiles**: Provide a list of file names to ignore for sorting. Default: []. Provide an array of strings.
16. **sort-json.settings.forceSort**: Forcefully sort and write JSON even if it is already sorted. Options: [True, False]. Default: False.
17. **sort-json.settings.jsonFormatIndent**: Set JSON formatting indent spaces. Options: [number, null]. Default: null. Provide a number or use editor tab size.

## Custom Sort

- Right click on a file and select `Do Custom Sort` command from `Sort JSON`.
- A quick pick items shows up where we can provide our own custom logic to sort the data.
- We can also save our custom comparisons in settings using `sort-json.settings.customComparisons` vscode settings which will shows up in the quick pick items.
- Please use conditional operators to sort with multiple conditions.

<img src="https://github.com/user-attachments/assets/601f2748-78ee-4b92-abb8-0704a3fa341f" width="1000px" />

**Sort Array**

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

- **Examples**:

  1. **Sort Ascending:**
      - Input: `[9, 2, 6, 5, 4, 1, 3, 0, 7]`
      - Comparison code: **`a - b`** or **`item1 - item2`** or **`x - y`**
      - Output: `[0, 1, 2, 3, 4, 5, 6, 7, 9]`

  2. **Sort by Item Length:**
      - Input: `["Hi", "this", "is", "a", "custom", "comparison", "sort"]`
      - Comparison code: **`item1.length - item2.length`**
      - Output: `["a", "Hi", "is", "this", "sort", "custom", "comparison"]`

  3. **Sort by Alphabetical Case-Insensitive Ascending:**
      - Input: `["Hi", "this", "is", "a", "custom", "comparison", "sort"]`
      - Comparison code: **`_.toLower(a) == _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1`**
      - Output: `["a", "comparison", "custom", "Hi", "is", "sort", "this"]`

  4. **Sort Collections by ID:**
      - Input: `[{"id": 2, "name": "bar"}, {"id": 1, "name": "foo"}]`
      - Comparison code: **`a.id - b.id`**
      - Output: `[{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}]`

  5. **Sort Collections by Name:**
      - Input: `[{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}]`
      - Comparison code: **`a.name == b.name ? 0 : a.name > b.name ? 1 : -1`**
      - Output: `[{"id": 1, "name": "foo"}, {"id": 2, "name": "bar"}]`

**Sort Object**

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

- **Examples**:

  1. **Sort by Key Length:**
      - Input: `{"name": "first item", "id": 1, "label": "foo"}`
      - Comparison code: **`key1.length - key2.length`** or **`item1.key.length - item2.key.length`**
      - Output: `{"id": 1, "name": "first item", "label": "foo"}`

  2. **Sort by Value Length:**
      - Input: `{"name": "foo", "id": 1, "label": "first item"}`
      - Comparison code: **`isAllString ? val1.length - val2.length : true`**
      - Output: `{"id": 1, "label": "foo", "name": "first item"}`

## Sort on save

There's a vscode setting for formatters (settings.json):

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit" // set to "explicit" to sort json files on save
  }
```

But you can also selectively enable/disable this formatter with (settings.json):

```jsonc
  "editor.codeActionsOnSave": {
      "source.fixAll.sort-json": "never" // set to "explicit" to sort json files on save. set to "never" to stop sorting on save
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
