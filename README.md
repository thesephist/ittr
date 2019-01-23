# ittr

[![npm ittr](https://img.shields.io/npm/v/ittr.svg)](http://npm.im/ittr)
[![Build Status](https://travis-ci.com/thesephist/ittr.svg?branch=master)](https://travis-ci.com/thesephist/ittr)
[![gzip size](http://img.badgesize.io/https://unpkg.com/ittr/dist/index.min.js?compression=gzip)](https://unpkg.com/ittr/dist/index.min.js)

Small library of iterator-related utility functions for JavaScript.

**Fully annotated source**: [GitHub Pages](https://thesephist.github.io/ittr/src/index.js.html).

Ittr doesn't try to be a comprehensive hub of all array methods -- there are lots of NPM libraries will do that very well. This is just a smaller collection of just the essential (by my definition of _essential_) array/iterator methods I've learned comes up very, very often in UI development, including many that aren't a part of the JavaScript standard.

## Features

- **Works with any JavaScript iterator, not just arrays**
- Nice API
- Tiny, simple to use
- Relatively fast, compared to native JavaScript array methods

## Usage

Import it with a `<script>` tag...

```html
<script src="https://unpkg.com/ittr/dist/index.min.js"></script>
```

... and you'll find all the API functions exposed under the `Ittr` global object.

You can also `npm install ittr`, which will allow you to use it in both Node.js and client-side projects.

Please see the [documentation](https://thesephist.github.io/ittr/src/index.js.html) for detailed API information.

### Build and test

You can build step with `npm build`, and run unit tests in `test/tests.js` with `npm test`.

## API documentation

`ittr` works with iterables in its own representation, to allow chaining calls. Create an Ittr object from a JavaScript iterable (generators, arrays, custom iterators) with the `iter()` function.

```javascript
const arr = [1, 2, 3, 4, 5];
const myIterable = iter(arr);
```

We can convert the Ittr object back to an array using `iter.toArray()`, or by iterating through them.

```javascript
myIterable.toArray();
// [1, 2, 3, 4, 5]
[...myIterable]
// [1, 2, 3, 4, 5]
const arr2 = []
for (const x of myIterable) {
    arr2.push(x);
}
// arr == [1, 2, 3, 4, 5]
```

iter has a variety of commonly used list methods with reasonable defaults.

### `iter.map(predicate)`

```javascript
iter([1, 2, 3, 4, 5]).map(x => x * x).toArray();
// [1, 4, 9, 16, 25]
```

Map over each item in the iterator.

Returns a new `iter` object, where the `predicate` was called with each each item in the iterator. The behavior is conceptually similar to native `Array.prototype.map`.

### `iter.filter(predicate)`

```javascript
iter([1, 2, 3, 4, 5]).filter(x => x % 2).toArray();
// [1, 3, 5]
```

Filter the iterator's items with a given predicate function.

Returns a new `iter` object that only contains items from the original iterator, where passing it into the predicate function yielded a truthy value.

If the `predicate` is omitted, an identity function (`x => x`) will be used by default. This allows you to write `iter(arr).filter()` to filter out falsy values.

### `iter.reduce(predicate, initial)`

```javascript
iter([1, 2, 3, 4, 5]).reduce((last, cur) => last * cur);
// 25, because 1 * 2 * 3 * 4 * 5 == 25
```

Reduce from the left over the iterator, with a given `predicate` and initial value.

The behavior is conceptually similar to the native `Array.prototype.reduce`.

### `iter.every(predicate)`

```javascript
iter([1, 2, 3, 4, 5]).every(x => x > 0);
// true

iter([1, 2, 3, 4, 5]).every(x => x % 2 === 0);
// false

iter([true, true, true, true]).every();
// true
```

Reports true only if calling the `predicate` function with every item in the iterator returns a truthy value. If called with an empty iterator, it returns true;

If no `predicate` function is passed, it'll default to the identity function (`x => x`);

### `iter.some(predicate)`

```javascript
iter([1, 2, 3, -4, -5]).some(x => x > 0);
// true

iter([1, 2, 3, 4, 5]).some(x => x < 0);
// false

iter([true, true, true, false]).some();
// true
```

Reports true if calling the `predicate` with one or more item(s) of the iterator returns a truthy value. If called with an empty iterator, it returns false.

If no `predicate` function is passed, it'll default to the identity function (`x => x`);

### `iter.flatMap(predicate)`

```javascript
const strings = ['foo bar', 'baz', 'hello javascript world'];
iter(strings).flatMap(str => str.split(' ')).toArray();
// ['foo', 'bar', 'baz', 'hello', 'javascript', 'world']

iter([[1, 2], [3], [4, 5, 6]]).flatMap();
// [1, 2, 3, 4, 5, 6]
```

`flatMap()` returns a new `iter` object. From each item in the original iterator, the predicate is called on each item, and the returned array is concatenated into the resulting list. This results in an effective map, then "flattening" with a depth of 1.

When the `predicate` function is not specified, an identity function (`x => x`) is used.

`iter.flatMap()` also obviates the need for a `iter.flatten()`, since calling `flatMap()` with no arguments or an identity function will just flatten the array to a depth of 1. (If you don't know how deep your arrays are nested, you either 1. will benefit from writing a more custom function or 2. should consider restructuring your code to be more deterministic.)

### `iter.partition(maxSize)`

```javascript
iter([1, 2, 3, 4, 5, 6, 7, 8]).partition(3);
// [[1, 2, 3], [4, 5, 6], [7, 8]]
```

Returns a new `iter` object, where each item is an array containing `maxSize` number of items from the original iterator, in order from the original iterator. If there are any items "left over", the last item in the returned iterator may have less than `maxSize` number of items.

### `iter.sortBy(predicate)`

```javascript
iter([
    {age: 3},
    {age: 15},
    {age: 9},
]).sortBy(obj => obj.age);
// [
//     {age: 3},
//     {age: 9},
//     {age: 15},
// ]
```

Returns a new `iter` object containing all the items from the original iterator, sorted by the comparator that `predicate` returns when it's called with each item. Internally, it just uses `Array.prototype.sort`.

When no `predicate` is specified, it defaults to the identity function, which results in identical behavior to `Array.prototype.sort`.

### `range(start [, end [, step]])`

```javascript
// one argument
range(5);
// [0, 1, 2, 3, 4]

// two arguments
range(2, 8.5);
// [2, 3, 4, 5, 6, 7, 8]

// three arguments
range(0, 3, 0.5);
// [0, .5, 1, 1.5, 2, 2.5]
```

`range()` is conceptually identical to Python's `range()` function. It's variadic and has three modes.

1. `range(start, end, step)`: Return an array of numbers, starting with `start`, and adding `step` each time, until the value exceeds `end`. The returned array never incldues a value equal to or greater than `end`.
2. `range(start, end)`: When `step` is omitted, it's assumed to be 1.
3. `range(end)`: When `start` is omitted, it's assumed to be 0. This means calling `range(n)` where `n` is a positive integer results in an array of length `n`, with increasing integer items.

### `zip(...arrays)`

```javascript
zip(
    [1, 2, 3],
    ['a', 'b', 'c'],
    ['X', 'Y', 'Z]
);
//  [
//     [1, 'a', 'X'],
//     [2, 'b', 'Y'],
//     [3, 'c', 'Z'],
// ]
```

`zip()` is conceptually identical to Python's `zip()`. Given a variable number of arrays, it returns an array whose length is equal to the length of the longest array given to it. In the returned array, the `n`th item is an array with the `n`th item from each argument array, in order.

`zip()` can also be called with a spread array (`...someArray`) to "unzip" a zipped array into its parts.

```javascript
const zippedArray = [
    [1, 'a', 'X'],
    [2, 'b', 'Y'],
    [3, 'c', 'Z'],
];
zip(...zippedArray);
// [
    // [1, 2, 3],
    // ['a', 'b', 'c'],
    // ['X', 'Y', 'Z],
// ]
```