export enum ComparisonTypes {
  randomize = "randomize the items",
  numberAscending = "sort list by number in ascending order",
  numberDescending = "sort list by number in descending order",
  stringAscending = "sort list by string in ascending order",
  stringDescending = "sort list by string in descending order",
  stringAscendingWithoutCase = "sort list by string in ascending order without case",
  stringDescendingWithoutCase = "sort list by string in descending order without case",
  keyAscending = "sort object by key in ascending order",
  keyDescending = "sort object by key in descending order",
  keyAscendingWithoutCase = "sort object by keys in ascending order without case",
  keyDescendingWithoutCase = "sort object by keys in descending order without case",
  valueAscending = "sort object by values in ascending order",
  valueDescending = "sort object by values in descending order",
  collectionAscendingByID = "sort collection by id in ascending order",
  collectionDescendingByID = "sort collection by id in descending order",
}

export default {
  [ComparisonTypes.numberAscending]: "isList && isAllNumber ? a - b : true",
  [ComparisonTypes.numberDescending]: "isList && isAllNumber ? b - a : true",
  [ComparisonTypes.stringAscending]: "isList && isAllString ? a === b ? 0 : a > b ? 1 : -1 : true",
  [ComparisonTypes.stringDescending]: "isList && isAllString ? a === b ? 0 : a < b ? 1 : -1 : true",
  [ComparisonTypes.stringAscendingWithoutCase]: "isList && isAllString ? _.toLower(a) === _.toLower(b) ? 0 : _.toLower(a) > _.toLower(b) ? 1 : -1 : true",
  [ComparisonTypes.stringDescendingWithoutCase]: "isList && isAllString ? _.toLower(a) === _.toLower(b) ? 0 : _.toLower(a) < _.toLower(b) ? 1 : -1 : true",
  [ComparisonTypes.keyAscending]: "isObject ? key1 === key2 ? 0 : key1 > key2 ? 1 : -1 : true",
  [ComparisonTypes.keyDescending]: "isObject ? key1 === key2 ? 0 : key1 < key2 ? 1 : -1 : true",
  [ComparisonTypes.keyAscendingWithoutCase]: "isObject ? _.toLower(key1) === _.toLower(key2) ? 0 : _.toLower(key1) > _.toLower(key2) ? 1 : -1 : true",
  [ComparisonTypes.keyDescendingWithoutCase]: "isObject ? _.toLower(key1) === _.toLower(key2) ? 0 : _.toLower(key1) < _.toLower(key2) ? 1 : -1 : true",
  [ComparisonTypes.valueAscending]: "isObject && isAllString ? val1 === val2 ? 0 : val1 > val2 ? 1 : -1 : true",
  [ComparisonTypes.valueDescending]: "isObject && isAllString ? val1 === val2 ? 0 : val1 < val2 ? 1 : -1 : true",
  [ComparisonTypes.collectionAscendingByID]: "isList && isCollection ? item1.id - item2.id : true",
  [ComparisonTypes.collectionDescendingByID]: "isList && isCollection ? item2.id - item1.id : true",
  [ComparisonTypes.randomize]: "Math.random() - 0.5",
};
