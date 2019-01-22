//> Identity function used as default values for some later
//  iteration functions
const identity = x => x;

//> Internally, this representation allows us to chain
//  iterator method calls together. Most of these methods
//  emit an object instance of `Iter` itself.
class Iter {

    constructor(iterable) {
        this.iterable = iterable;
    }

    //> Normal map over an iterator
    map(fn) {
        const result = [];
        for (const member of this.iterable) {
            result.push(fn(member));
        }
        return new Iter(result);
    }

    //> Normal filter from an iterator to an iterable
    filter(fn = identity) {
        const result = [];
        for (const member of this.iterable) {
            if (fn(member)) {
                result.push(member);
            }
        }
        return new Iter(result);
    }

    //> Normal left reduce over an iterator
    reduce(fn, initial) {
        let result = initial;
        for (const member of this.iterable) {
            result = fn(result, member);
        }
        return result;
    }

    //> Reports true if every member of the iterable
    //  evaluates to truthy value when passed into `fn`
    every(fn = identity) {
        for (const member of this.iterable) {
            if (!fn(member)) {
                return false;
            }
        }
        return true;
    }

    //> Reports true if one or more member(s) of the iterable
    //  evaluates to truthy value when passed into `fn`
    some(fn = identity) {
        for (const member of this.iterable) {
            if (fn(member)) {
                return true;
            }
        }
        return false;
    }

    //> Maps over an iterable and flattens each returned value from `fn`
    //  with depth 1 before concatenating it into the result iterable.
    flatMap(fn = identity) {
        const result = this.reduce((cur, next) => cur.concat(fn(next)), []);
        return new Iter(result);
    }

    //> Partition the list of iterable values
    //  into a list of arrays, each with max size `maxSize`, in order
    //  that the members appear in the iterable. e.g.
    //  `iter([1, 2, 3, 4, 5]).partition(3).toArray() == [[1, 2, 3], [4, 5]]`
    partition(maxSize) {
        const result = [[]];
        let idx = 0;
        let count = 0;
        for (const member of this.iterable) {
            result[idx].push(member);
            count ++;
            if (count % maxSize === 0) {
                result.push([]);
                idx ++;
            }
        }
        return new Iter(result);
    }

    //> Perform a non-stable sort of the iterable list values
    //  by some deterministic comparator function that takes each member
    //  and returns a value by which each member should be compared.
    //  In practice, I've found this more useful than the general
    //  comparison-based sort method in JavaScript `Array.prototype.sort`.
    sortBy(fn = identity) {
        const result = [...this.iterable].sort((a, b) => {
            const fnA = fn(a);
            const fnB = fn(b);
            if (fnA < fnB) {
                return -1;
            } else if (fnA > fnB) {
                return 1;
            } else {
                return 0;
            }
        });
        return new Iter(result);
    }

    //> Convert whatever iterable value is currently represented
    //  by the `Iter` instance into a flat array.
    toArray() {
        return [...this.iterable];
    }

    //> An `Iter` instance is also a JavaScript iterator, which means
    //  we can spread (`...iter`) and `for...of` loop over it.
    [Symbol.iterator]() {
        const iterable = this.iterable;
        const gen = function* () {
            for (const member of iterable) {
                yield member;
            }
        }
        return gen();
    }

}

//> Shorthand function to convert an iterator into a chainable
//  `Iter` object.
const iter = x => new Iter(x);

//> Helper implementation of `range` that takes exactly three arguments.
//  The exposed `range()` API is variadic, but that calls this with deterministic
//  order of arguments.
function _range(start, end, step) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}

//> `range()` function whose API is identical to Python `range`. Returns an Array instance.
function range(a1, a2, a3) {
    if (a3 === undefined) {
        if (a2 === undefined) {
            return _range(0, a1, 1);
        } else {
            return _range(a1, a2, 1);
        }
    } else {
        return _range(a1, a2, a3);
    }
}

//> Similar to Python `zip()`, zips together arrays passed in. `zip()` is variadic.
//  e.g. `zip([1, 2], ['a', 'b']) => [[1, 'a'], [2, 'b']]`
function zip(...arrays) {
    const arrayCount = arrays.length;
    const maxLen = Math.max(...arrays.map(a => a.length));
    const result = new Array(maxLen);
    for (let i = 0; i < maxLen; i ++) {
        const x = new Array(arrayCount);
        for (let j = 0; j < arrayCount; j ++) {
            x[j] = arrays[j][i];
        }
        result[i] = x;
    }
    return result;
}

//> Export those APIs!
const exposedNames = {
    iter,
    range,
    zip,
}
if (typeof window === 'object') {
    /* istanbul ignore next */
    window.Ittr = exposedNames;
}
if (typeof module === 'object' && module.exports) {
    module.exports = exposedNames;
}

