class Iter {

    constructor(iterable) {
        this.iterable = iterable;
    }

    map(fn) {
        const result = [];
        for (const member of this.iterable) {
            result.push(fn(member));
        }
        return new Iter(result);
    }

    filter(fn) {
        const result = [];
        for (const member of this.iterable) {
            if (fn(member)) {
                result.push(member);
            }
        }
        return new Iter(result);
    }

    reduce(fn, initial) {
        let result = initial;
        for (const member of this.iterable) {
            result = fn(result, member);
        }
        return new Iter(result);
    }

    every(fn) {
        for (const member of this.iterable) {
            if (!fn(member)) {
                return false;
            }
        }
        return true;
    }

    some(fn) {
        for (const member of this.iterable) {
            if (fn(member)) {
                return true;
            }
        }
        return false;
    }

    flatMap(fn) {
        return this.reduce((cur, next) => cur.concat(fn(next)), []);
    }

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

    sortBy(fn) {
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

    toArray() {
        return [...this.iterable];
    }

    [Symbol.iterator]() {
        return this.iterable;
    }

}

const iter = x => new Iter(x);

function _range(start, end, step) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}

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

module.exports = {
    iter,
    range,
    zip,
}

