import { defineState } from '@lwc/state';

export default defineState(({ atom, computed, setAtom }) => {
    const opportunities = atom([]);
    const setOpportunities = (newOpportunities) => {
        setAtom(opportunities, newOpportunities);
    };

    const totalAmount = computed([opportunities], (oppties) =>
        oppties.reduce((total, oppty) => total + oppty.Amount.value, 0)
    );

    return {
        opportunities,
        setOpportunities,
        totalAmount
    };
});
