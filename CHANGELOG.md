# Change Log

## v20.0.0

- Enhanced - Now supports sorting partially selected json text. Now its not mandated to select json text with brackets.
- Added - `sort-json.settings.forceSort` setting helps to sort and re paint the JSON string even if it is already sorted
- Added - `sort-json.settings.jsonFormatIndent` setting helps to provide a custom spacing to format the JSON. Set to empty to use the editor's tab size
- Added - `Collection` in the `sort-json.settings.sortValueTypeOrder`. Helps to sort the JSON by `Collection` value type
- Modified - Now Sort JSON respects the `files.insertFinalNewline` setting.
- Fixed - not sorting if the JSON has a `null` value issue fixed.

## v19.1.2

- Readme update

## v19.1.1

- Fixed - JSON sorts automatically on selecting `Source Action` from context issue fixed.

## v19.1.0

- Added - `sort-json.settings.ignoreFiles` - Provide list of file names to ignore sort from code action quick fix
- Fixed - On sorting not adding double quotes for keys and values for the `json`, `jsonc` type files issue fixed.

## v19.0.0

- Removed - `Preserver Order` prompt in the Collection. instead don't select any key and click ok on the quick pick to preserver the order.
- Added - `Sort Ascending` and `Sort Descending` to quick fix.
- Added - `source.fixAll.sort-json` code action. Set to false to prevent from auto sorting on save. Defaults to true,
- Enhanced - `sort-json.settings.orderOverrideKeys` now support regex pattern to set a overridden keys for a matching file pattern.

```json
{
  "sort-json.settings.orderOverrideKeys": {
    "assets/data/.*.json": ["id", "name", "username", "email"], // order override keys specific to json files inside assets folder
    "package.json": ["name", "version"], // order override keys specific to package.json file
    "*": ["id", "title"] // order override keys for all files
  }
}
```

- Fixed - Overriding object keys order on custom sorting issue fixed.
- Modified - Code optimized.

## v18.0.0

- Added - `Sort Randomize` - Randomly sort the array or object.

## v17.0.3

- Fixed - Nested sorting is not happening if no key is selected for the array of object sorting.
  On sorting collection (Array of object) select the key `Preserve Order` to preserve the order of the array but still sort the nested object based on the sort level.

## v17.0.2

- Sorts again even if its already sorted and rewrites the same issue fixed.

## v17.0.1

- Sort override issue fix.

## v17.0.0

- Updated - `sort-json.settings.orderOverrideKeys` - Now we can give both array of keys or an object with filename that has array of keys to set order override keys for a specific filename.
  - Example 1:
  ```jsonc
  {
    "sort-json.settings.orderOverrideKeys": {
      "package.json": ["name", "version"], // order override keys specific to package.json file
      "": ["id", "title"] // order override keys for all files
    }
  }
  ```
  - Example 2:
  ```jsonc
  {
    "sort-json.settings.orderOverrideKeys": ["id", "title"] // order override keys for all files
  }
  ```

## v16.0.0

- Added - `sort-json.settings.showInfoMsg` in settings. Set to false to disable Sort Successfully info popup.
- Modified - Now we preserve trailing newline on sorting.

## v15.0.0

- Added - `sort-json.settings.preserveUnicodeString` - Helps to preserver unicode sequence string.
  - For example: unicode string: `\u21D3` will not be converted to (`↧`) character on sorting.
  - This is unstable and may not fully compatible with all unicode's. Please use this with caution.

## v14.0.0

- Support for Sort JSON with comments.
- Support for Sort JSON with ES6 standards ( allows single quotes and keys with no quotes ).
- Added - `...` spread operator to spread remaining keys in middle of overridden keys.
  - For Example: `sort-json.settings.orderOverrideKeys`: [ "id", "...", "body" ]
  - Here, `...` values will be replaced by the remaining object ordered keys.

## v13.1.1

- exclude path can accept keys with special characters. ex: `a.b["foo-bar"][0].c`

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
