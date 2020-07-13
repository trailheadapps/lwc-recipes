import { getTermOptions, calculateMonthlyPayment } from 'c/mortgage';

describe('c-mortgage', () => {
    describe('calculateMonthlyPayment function', () => {
        it('returns monthly payment with valid inputs', () => {
            const principal = 50000;
            const years = 20;
            const rate = 3;

            // Get a two decimal place string representation of long decimal
            const expectedResult = (277.298798926959).toFixed(2);

            const monthlyPayment = calculateMonthlyPayment(
                principal,
                years,
                rate
            );
            // convert long decimal to two decimal places and compare
            expect(monthlyPayment.toFixed(2)).toBe(expectedResult);
        });
        it('returns zero with invalid inputs', () => {
            // each value tests each param as falsy, third param also tested for explicit zero value
            const invalidInputs = require('./data/invalidInputsTestData.json');

            // invoke with 4 invalid input sets and store each return value in an array
            const results = invalidInputs.inputs.map((item) =>
                calculateMonthlyPayment(item.principal, item.years, item.rate)
            );

            expect(results).toMatchObject(invalidInputs.expectedResults);
        });
    });

    it('getTermOptions returns valid term options', () => {
        const termOptions = require('./data/termOptions.json');

        expect(getTermOptions()).toMatchObject(termOptions);
    });
});
