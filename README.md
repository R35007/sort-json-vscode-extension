# Sort JSON

Simple JSON Object and Array sort.

<img width="600" src="https://user-images.githubusercontent.com/23217228/205433864-c2bef3b1-cb6a-4b69-a61b-410cc1728e2c.gif">

## Features

- Sort Ascending
- Sort Descending
- Sort Ascending Deep
- Sort Descending Deep
- Sort By Value
- Sort By Key
- Sort By Value Length
- Sort By Key Length
- Sort By Value Type
- Sort By Custom Comparison.
- Sort Object
- Sort List items
- Sort Collections

## Usage

- Right click on a file and select `Sort` command to sort the full json file object.
- Select the json object you need to sort and right click and select `Sort` command to sort the selected json object.
- Select `Deep Sort` command to sort nested objects including arrays.
- Sorting collection it will prompt you to pick a attribute to sort.
- We can set a custom sorting order using `sort-json.settings.orderOverride`
- Sorting Type : `Key`, `Key Length`, `Value`, `Value Length`, `Value Type`
- If the Sort type is `Value Type` we can set a custom value type order using `sort-json.settings.sortValueTypeOrder`
- Custom Comparison Sort shows a quick pick items where we can provide our own custom logic to sort the data.

## Custom Sort

 - Right click on a file and select `Custom Comparison Sort` command from `Sort JSON`.
 - A quick pick items shows up where we can provide our own custom logic to sort the data. 
 - We can also save our custom comparisons in settings using `sort-json.settings.customComparisons` vscode settings which will shows up in the quick pick items.
 - Please use conditional operators to sort with multiple conditions.

>Limitations: This custom comparison sort will only sort at the top level of the selected JSON. It will not do a deep sort.

`Sort Array`
- predefined variables - `a`, `b`, `item1`, `item2`, `key1`, `key2`, `val1`, `val2`, `x`, `y`.
  - `item1`, `key1`, `val1`, `x` is equal to `a`.
  - `item2`, `key2`, `val2`, `y` is equal to `b`.
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
  // comparison code = a.toLowerCase() == b.toLowerCase() ? 0 : a.toLowerCase() > b.toLowerCase() ? 1 : -1
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
- predefined variables - `a`, `b`, `item1`, `item2`, `key1`, `key2`, `val1`, `val2`, `x`, `y`.
  - `key1` - Object first key
  - `key2` - Object second key
  - `val1` - Object first value
  - `val2` - Object second value
  - `item1` - { key: `key1`, val: `val1` }
  - `item2` - { key: `key2`, val: `val2` }
  - `a`, `x` is equal to `item1`
  - `b`, `y` is equal to `item2`

- examples:
  ```jsonc
  // sort by key length
  { "name": "first item", "id": 1, "label": "foo" }
  // comparison code = key1.length - key2.length or item1.key.length - item2.key.length
  // sort to  { "id": 1, "name": "first item", "label": "foo" }

  // sort by value length
  { "name": "foo", "id": 1, "label": "first item" }
  // comparison code = JSON.stringify(val1).length - JSON.stringify(val2).length // converting values to JSON.stringify() to get its length.
  // sort to  { "id": 1, "label": "foo", "name": "first item" }
  ```

**Enjoy!**
