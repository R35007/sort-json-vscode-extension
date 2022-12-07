export enum ComparisonTypes {
  sort = "sort ascending",
  reverse = "sort descending",
  keyLength = "sort object ascending by key length",
  keyLengthReverse = "sort object descending by key length",
  valueLength = "sort object ascending by value length",
  valueLengthReverse = "sort object descending by value length",
  sortById = "sort collection ascending by id",
  sortByIdReverse = "sort collection descending by id",
  alphabeticalSort = "sort alphabetically ascending with case sensitive",
  alphabeticalSortReverse = "sort alphabetically descending with case sensitive",
  alphabeticalSortCaseInsensitive = "sort alphabetically ascending without case sensitive",
  alphabeticalSortCaseInsensitiveReverse = "sort alphabetically descending without case sensitive",
}

export default {
  [ComparisonTypes.sort]: "a - b",
  [ComparisonTypes.reverse]: "b - a",
  [ComparisonTypes.keyLength]: "key1.length - key2.length",
  [ComparisonTypes.keyLengthReverse]: "key2.length - key1.length",
  [ComparisonTypes.valueLength]: "JSON.stringify(val1).length - JSON.stringify(val2).length",
  [ComparisonTypes.valueLengthReverse]: "JSON.stringify(val2).length - JSON.stringify(val1).length",
  [ComparisonTypes.sortById]: "item1.id - item2.id",
  [ComparisonTypes.sortByIdReverse]: "item2.id - item1.id",
  [ComparisonTypes.alphabeticalSort]: "a == b ? 0 : a > b ? 1 : -1",
  [ComparisonTypes.alphabeticalSortReverse]: "a == b ? 0 : a < b ? 1 : -1",
  [ComparisonTypes.alphabeticalSortCaseInsensitive]: "a.toLowerCase() == b.toLowerCase() ? 0 : a.toLowerCase() > b.toLowerCase() ? 1 : -1",
  [ComparisonTypes.alphabeticalSortCaseInsensitiveReverse]: "a.toLowerCase() == b.toLowerCase() ? 0 : a.toLowerCase() < b.toLowerCase() ? 1 : -1",
};
