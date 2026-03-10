import opportunitiesStateManager from '../opportunitiesStateManager';

describe('opportunitiesStateManager', () => {
    it('initializes with empty opportunities and zero total amount', () => {
        const state = opportunitiesStateManager();

        expect(state.value.opportunities).toEqual([]);
        expect(state.value.totalAmount).toBe(0);
    });

    it('updates opportunities when setOpportunities is called', () => {
        const state = opportunitiesStateManager();

        const opportunities = [
            { Id: '1', Amount: { value: 1000 } },
            { Id: '2', Amount: { value: 2000 } }
        ];

        state.value.setOpportunities(opportunities);

        expect(state.value.opportunities).toEqual(opportunities);
    });

    it('updates totalAmount when setOpportunities is called', () => {
        const state = opportunitiesStateManager();

        const opportunities = [
            { Id: '1', Amount: { value: 1000 } },
            { Id: '2', Amount: { value: 2000 } }
        ];

        state.value.setOpportunities(opportunities);

        expect(state.value.totalAmount).toBe(3000);
    });
});
