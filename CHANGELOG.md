# Change Log

## v13.1.0

- Set a default custom sort code in `sort-json.settings.defaultCustomSort` settings, so that on command `Do Custom Sort` wont prompt for code each time.
- Leave `sort-json.settings.defaultCustomSort` setting to empty to prompt you the custom sort comparison code each time on click of `Do Custom Sort` command.

## v13.0.0

- Sort JSON with comments. Note: comments will not be preserved and will be removed.

## v12.1.0

- Sort By Value Length not working issue fixed.

## v12.0.1

- Typo fixes

## v12.0.0

- More settings has been added, modified and renamed.
- Custom sort can also sort into multiple nested levels.
- `Deep Sort`, `Deep Reverse Sort` has been removed. Change the level of sort to sort nested objects.
- Can set different sort types of both `List` and `Object` sort.
- `Sort Level` - Set sort level to `-1` to a full deep sort. Set sort level to `1` to sort only at the top level. 
- Set sort level to `0` to avoid sorting. Default Sort Level is `-1`.
  
## v11.0.0

- Build size reduced using webpack build.
- Sort by key length issue fixed
  
## v10.0.0

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
