export default [
  {
    "comparison": "a - b",
    "description": "sort ascending"
  },
  {
    "comparison": "b - a",
    "description": "sort descending"
  },
  {
    "comparison": "key1.length - key2.length",
    "description": "sort object by key length ascending"
  },
  {
    "comparison": "key2.length - key1.length",
    "description": "sort object by key length descending"
  },
  {
    "comparison": "JSON.stringify(val1).length - JSON.stringify(val2).length",
    "description": "sort object by value length ascending"
  },
  {
    "comparison": "JSON.stringify(val2).length - JSON.stringify(val1).length",
    "description": "sort object by value length ascending"
  },
  {
    "comparison": "item1.id - item2.id",
    "description": "sort array of object by its id ascending"
  },
  {
    "comparison": "item2.id - item1.id",
    "description": "sort array of object by its id descending"
  },
  {
    "comparison": "a == b ? 0 : a > b ? 1 : -1",
    "description": "case sensitive alphabetical ascending sort"
  },
  {
    "comparison": "a == b ? 0 : a < b ? 1 : -1",
    "description": "case sensitive alphabetical descending sort"
  },
  {
    "comparison": "a.toLowerCase() == b.toLowerCase() ? 0 : a.toLowerCase() > b.toLowerCase() ? 1 : -1",
    "description": "case in-sensitive alphabetical ascending sort"
  },
  {
    "comparison": "a.toLowerCase() == b.toLowerCase() ? 0 : a.toLowerCase() < b.toLowerCase() ? 1 : -1",
    "description": "case in-sensitive alphabetical descending sort"
  }
];
