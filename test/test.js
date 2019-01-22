const {
    iter,
    range,
    zip,
} = require('../src/index.js');

const expect = require('chai').expect;

describe('iter', () => {

    describe('map', () => {

        it('should map members of an iterable correctly', () => {
            const result = iter([1, 2, 3, 4, 5]).map(x => x + 5).toArray();
            expect(result).to.deep.equal([6, 7, 8, 9, 10]);
        });

    });

    describe('filter', () => {

        it('should filter items by the given function', () => {
            const result = iter([10, 15, 13, 23, 25]).filter(n => n % 5 == 0).toArray();
            expect(result).to.deep.equal([10, 15, 25]);
        });

        it('should filter by the member values if no function provided', () => {
            const result = iter([1, 2, 3, 0, 4, 0, 5]).filter().toArray();
            expect(result).to.deep.equal([1, 2, 3, 4, 5]);
        });

    });

    describe('reduce', () => {

        it('should reduce from the right, starting from the given initializer', () => {
            const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reduce((a, b) => a * b, 1);
            expect(result).to.equal(3628800);
        });

    });

    describe('every', () => {

        it('returns true if every member evaluates to true in fn(x)', () => {
            const result = iter([2, 4, 6, 8, 12, 16]).every(x => x % 2 === 0);
            expect(result).to.be.true;
        });

        it('returns false if any member fails the provided condition', () => {
            const result = iter([2, 4, 5, 8, 12, 16]).every(x => x % 2 === 0);
            expect(result).to.be.false;
        });

        it('evaluates the member values as bools if no check function is provided', () => {
            const result = iter(['a', 'b', 'c', 'd']).every();
            expect(result).to.be.true;
            const result2 = iter(['a', 'b', 'c', 'd', '']).every();
            expect(result2).to.be.false;
        });

        it('returns true on an empty array', () => {
            expect(iter([]).every()).to.be.true;
        });

    });

    describe('some', () => {

        it('returns true if at least one member evaluates to true in fn(x)', () => {
            const result = iter([2, 4, 6, 8, 12, 15]).some(x => x % 2 === 1);
            expect(result).to.be.true;
        });

        it('returns false if all members fail the provided condition', () => {
            const result = iter([2, 4, 5, 8, 12, 16]).every(x => x % 2 === 1);
            expect(result).to.be.false;
        });

        it('evaluates the member values as bools if no check function is provided', () => {
            const result = iter([0, 0, 0, 1]).some();
            expect(result).to.be.true;
            const result2 = iter([0, 0, 0, 0]).some();
            expect(result2).to.be.false;
        });

        it('returns false on an empty array', () => {
            expect(iter([]).some()).to.be.false;
        });

    });

    describe('flatMap', () => {

        it('maps, then flattens to depth of 1', () => {
            const result = iter([[1, 2, 3], [4, 5, 6]]).flatMap(a => a.reverse()).toArray();
            expect(result).to.deep.equal([3, 2, 1, 6, 5, 4]);
        })

        it('just flattens the array to depth of 1 if no function is provided', () => {
            const result = iter([])
        });

        it('flattens to depth of just 1, no more', () => {
            const result = iter([[1, 2, 3, [9]], [4, 5], [6]]).flatMap().toArray();
            expect(result).to.deep.equal([1, 2, 3, [9], 4, 5, 6]);
        });

    });

    describe('partition', () => {

        it('partitions the array by a give max size', () => {
            const result = iter([1, 2, 3, 4, 5, 6, 7]).partition(3).toArray();
            expect(result).to.deep.equal([[1, 2, 3], [4, 5, 6], [7]]);
        });

    });

    describe('sortBy', () => {

        it('sorts the array by the given comparator', () => {
            const result = iter([
                {
                    age: 13,
                },
                {
                    age: 10,
                },
                {
                    age: 5,
                },
                {
                    age: 20,
                }
            ]).sortBy(o => o.age).toArray();
            expect(result).to.deep.equal([
                {
                    age: 5,
                },
                {
                    age: 10,
                },
                {
                    age: 13,
                },
                {
                    age: 20,
                }
            ]);
        });

        it('sorts by the iterable member value itself if no fn provided', () => {
            const result = iter([1, 5, 2, 6, 2, 3, 5]).sortBy().toArray();
            expect(result).to.deep.equal([1, 2, 2, 3, 5, 5, 6]);
        });

    });

    describe('toArray', () => {

        it('should return the iterable object as a normal array', () => {
            const gen = function* () {
                yield 1;
                yield 2;
                yield 3;
                yield 4;
                yield 5;
            }
            expect(iter(gen()).toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });

    });

    it('is chainable', () => {
        const result = iter([1, 2, 3, 4, 5, 6, 7, 8])
            .partition(3).flatMap(a => a.reverse()).toArray();
        expect(result).to.deep.equal([3, 2, 1, 6, 5, 4, 8, 7]);
    });

    it('is natively iterable in JavaScript', () => {
        const result = [];
        for (const member of iter([1, 2, 3, 4, 5, 6, 7])) {
            result.push(member);
        }
        expect(result).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
    });

});

describe('range', () => {

    it('takes one argument as upper limit, with step 1', () => {
        expect(range(5)).to.deep.equal([0, 1, 2, 3, 4]);
    })

    it('takes two arguments as start and end, with step 1', () => {
        expect(range(2, 6)).to.deep.equal([2, 3, 4, 5]);
    })

    it('takes three arguments as start, end, and step', () => {
        expect(range(1, 10, 3)).to.deep.equal([1, 4, 7]);
    });

});

describe('zip', () => {

    it('zips arbitrary number of ararys together', () => {
        const result = zip([1, 2, 3], ['a', 'b', 'c'], ['X', 'Y', 'Z']);
        expect(result).to.deep.equal([
            [1, 'a', 'X'],
            [2, 'b', 'Y'],
            [3, 'c', 'Z']
        ]);
    });

    it('zips out-of-bounds array values as undefined', () => {
        const result = zip([1, 2, 3], ['a', 'b']);
        expect(result).to.deep.equal([
            [1, 'a'],
            [2, 'b'],
            [3, undefined]
        ]);
    });

    it('returns an empty array if empty arrays area provided', () => {
        expect(zip([], [])).to.deep.equal([]);
    });

});

