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

});

