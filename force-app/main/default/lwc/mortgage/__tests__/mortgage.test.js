import { getTermOptions, calculateMonthlyPayment } from 'c/mortgage';

describe('c-mortgage', () => {
    describe('getTermOptions function', () => {
        it('returns monthly payment with valid inputs', () => {
            const principal = 50000;
            const years = 20;
            const rate = 3;

            const expectedResult = 277.298798926959;

            const monthlyPayment = calculateMonthlyPayment(
                principal,
                years,
                rate
            );
            expect(monthlyPayment).toBe(expectedResult);
        });
        it('returns zero with invalid inputs', () => {
            // each value tests each param as falsy, third param also tested for explicit zero value
            const invalidInputs = require('./data/invalidInputs.json');

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
