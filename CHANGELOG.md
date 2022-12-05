# Change Log

## v9.1.1

- Removed unused configurations.
  
## v9.1.0

- Build size reduced
- Bug fixes
  
## v9.0.0

- Added - `Custom Comparison Sort` - Provide your own custom comparison code to sort any data. Limited to only top level sort and not deep sort.
- Added - `sort-json.settings.customComparisons` - configuration. Helps to store our custom comparison logic which will shows up in the quick pick items.

## v8.1.0

 - Reduced build size
 - Added editor context sub menus. Now all sort json commands comes under a `Sort JSON` sub menu.

## v8.0.0

- Bug Fixes
  - Not using editors indent size on sorting - `Fixed`.
- Added
  - `sort-json.settings.ignoreArraysOnDeepSort` - If set to true, It ignores Arrays on deep sort. Still sorts the object inside the array.
  - `sort-json.settings.ignoreObjectsOnDeepSort` - If set to true, It ignores Objects on deep sort.
  - `sort-json.settings.deepSortLevel` - Set deep Sort level. Set to -1 to sort dull deep level.
  - `sort-json.settings.excludePaths` - list of object paths to exclude from deep sorting. Ex: `[1].comments` or `user[0].address`

## v7.0.0

- added `Sort JSON: Toggle Sort Case-Sensitive` command and editor context.

## v6.0.0

- added editor context - `Set Sort Type`: Set JSON Object Sorting Type.

## v5.0.0

- added Command - `Sort JSON: Set Sort Type`: Set JSON Object Sorting Type.

## v4.0.0

- You can now sort JSON Object by its value type.
- added `Value Type` in `sort-json.settings.sortType`
- added `sort-json.settings.sortValueTypeOrder`- Set your custom Value Type Sort Order

## v3.0.0

- added `sort-json.settings.sortType`
- Now can able to sort by `Key, Key Length, Value, Value Length`. Default is `Key`

## v2.0.0

- added `sort-json.settings.isCaseSensitive` - to sort with case sensitive
- Logo Change
- Repo Change

## v1.0.0

- Initial release
