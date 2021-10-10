# Sort Json

Simple JSON Object and Array sort.

## Features

- Right click on any .json file and select `Sort` command to sort the full json file object.
- Select the json object you need to sort and right click and select `Sort` command to sort the selected json object.
- Select `Sort Deep` command to sort nested objects including arrays.
- Sorting collection it will prompt you to pick a attribute to sort.
- We can set a custom sorting order using `sort-json.settings.orderOverride`
- Sorting Type : `Key`, `Key Length`, `Value`, `Value Length`, `Value Type`
- If the Sort type is `Value Type` we can set a custom value type order using `sort-json.settings.sortValueTypeOrder`

## Extension Commands

This extension contributes the following commands:

- `Sort JSON: Sort`: Sort JSON object ascending.
- `Sort JSON: Sort Deep`: Sort all nested JSON object ascending.
- `Sort JSON: Sort Reverse`: Sort JSON object descending.
- `Sort JSON: Sort Deep Reverse`: Sort all nested JSON object descending.
- `Sort JSON: Set Sort Type`: Set JSON Object Sorting Type.
- `Sort JSON: Toggle Sort Case-Sensitive`: Toggles Sort Sort Case-Sensitive.

## Extension Settings

This extension contributes the following settings:

- `sort-json.settings.contextMenu`: show/hide editor context items.
- `sort-json.settings.orderOverride`: Override the object sort order.
- `sort-json.settings.isCaseSensitive`: sort comparision with case sensitive.
- `sort-json.settings.sortType`: Set JSON Object Sorting Type.
- `sort-json.settings.sortValueTypeOrder`: Set Value Type Sort Order. This order works when you select sortType as 'Value type'.

## Preview

<img width="600" src="./images/preview.gif">

**Enjoy!**
