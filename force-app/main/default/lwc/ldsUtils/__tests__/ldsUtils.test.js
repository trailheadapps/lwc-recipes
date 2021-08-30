import { reduceErrors } from 'c/ldsUtils';

describe('c-lds-utils', () => {
    describe('reduceErrors', () => {
        it('reduces single error with message in body', () => {
            const FULL_ERROR = { body: { message: 'mockError' } };
            const REDUCED_ERROR = [FULL_ERROR.body.message];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });

        it('reduces single error with multiple bodies with messages', () => {
            const FULL_ERROR = {
                body: [{ message: 'mockError1' }, { message: 'mockError2' }]
            };
            const REDUCED_ERROR = [
                FULL_ERROR.body[0].message,
                FULL_ERROR.body[1].message
            ];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });

        it('reduces single error message string', () => {
            const FULL_ERROR = { message: 'mockError' };
            const REDUCED_ERROR = [FULL_ERROR.message];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });

        it('reduces array of error message string', () => {
            const FULL_ERROR = [
                { message: 'mockError1' },
                { message: 'mockError2' }
            ];
            const REDUCED_ERROR = [
                FULL_ERROR[0].message,
                FULL_ERROR[1].message
            ];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });

        it('reduces single fieldError with error message string', () => {
            const FULL_ERROR = [
                //error.body.output.fieldErrors["Number_of_Waves__c"][0].message
                {
                    body: {
                        output: {
                            fieldErrors: { field1: [{ message: 'mockError1' }] }
                        }
                    }
                }
            ];
            const REDUCED_ERROR = [
                FULL_ERROR[0].body.output.fieldErrors.field1[0].message
            ];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });

        it('reduces array of fieldErrors with error message string', () => {
            const FULL_ERROR = [
                //error.body.output.fieldErrors["Number_of_Waves__c"][0].message
                {
                    body: {
                        output: {
                            fieldErrors: {
                                field1: [{ message: 'mockError1' }],
                                field2: [{ message: 'mockError3' }]
                            }
                        }
                    }
                }
            ];
            const REDUCED_ERROR = [
                FULL_ERROR[0].body.output.fieldErrors.field1[0].message,
                FULL_ERROR[0].body.output.fieldErrors.field2[0].message
            ];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });
        it('reduces single error with unknown shape', () => {
            const FULL_ERROR = { statusText: 'mockStatus' };
            const REDUCED_ERROR = [FULL_ERROR.statusText];

            const reduced = reduceErrors(FULL_ERROR);

            expect(reduced).toStrictEqual(REDUCED_ERROR);
        });
    });
});
