const getTermOptions = () => {
    return [
        { label: '20 years', value: 20 },
        { label: '25 years', value: 25 },
        { label: '30 years', value: 30 },
        { label: '35 years', value: 35 },
        { label: '40 years', value: 40 }
    ];
};

const calculateMonthlyPayment = (principal, years, rate) => {
    if (principal && years && rate && rate > 0) {
        const monthlyRate = rate / 100 / 12;
        const monthlyPayment =
            (principal * monthlyRate) /
            (1 - Math.pow(1 / (1 + monthlyRate), years * 12));
        return monthlyPayment;
    }
    return 0;
};

export { getTermOptions, calculateMonthlyPayment };
