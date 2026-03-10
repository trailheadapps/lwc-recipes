import { createElement } from '@lwc/engine-dom';
import { fromContext } from '@lwc/state';
import { stateManagerInstanceMock } from '@lwc/state-test-utils';
import OpportunitiesSummary from 'c/opportunitiesSummary';

jest.mock('@lwc/state', () => {
    const actual = jest.requireActual('@lwc/state');
    return {
        ...actual,
        fromContext: jest.fn()
    };
});

// Helper function to wait until the microtask queue is empty. This is needed for promise
// timing.
async function flushPromises() {
    return Promise.resolve();
}

describe('c-opportunities-summary', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('renders correctly with no opportunities', async () => {
        const mockState = stateManagerInstanceMock({
            opportunities: [],
            totalAmount: 0
        });
        fromContext.mockReturnValue(mockState);

        const element = createElement('c-opportunities-summary', {
            is: OpportunitiesSummary
        });

        document.body.appendChild(element);
        await flushPromises();

        const card = element.shadowRoot.querySelector('lightning-card');
        expect(card.title).toBe('Opportunities Summary');

        const countText = element.shadowRoot.querySelector('p');
        expect(countText.textContent).toBe('Opportunity count: 0');

        const formattedNumber = element.shadowRoot.querySelector(
            'lightning-formatted-number'
        );
        expect(formattedNumber.value).toBe(0);
        expect(formattedNumber.formatStyle).toBe('currency');
        expect(formattedNumber.currencyCode).toBe('USD');
    });

    it('renders correctly after state manager updates with data', async () => {
        const mockState = stateManagerInstanceMock({
            opportunities: [],
            totalAmount: 0
        });
        fromContext.mockReturnValue(mockState);

        const element = createElement('c-opportunities-summary', {
            is: OpportunitiesSummary
        });

        document.body.appendChild(element);
        await flushPromises();

        mockState.updateValue({
            opportunities: [
                { Id: '1', Amount: { value: 1000 } },
                { Id: '2', Amount: { value: 2000 } },
                { Id: '3', Amount: { value: 3000 } }
            ],
            totalAmount: 6000
        });

        await flushPromises();

        const countText = element.shadowRoot.querySelector('p');
        expect(countText.textContent).toBe('Opportunity count: 3');

        const formattedNumber = element.shadowRoot.querySelector(
            'lightning-formatted-number'
        );
        expect(formattedNumber.value).toBe(6000);
    });

    it('is accessible', async () => {
        const mockState = stateManagerInstanceMock({
            opportunities: [
                { Id: '1', Amount: { value: 1000 } },
                { Id: '2', Amount: { value: 2000 } },
                { Id: '3', Amount: { value: 3000 } }
            ],
            totalAmount: 6000
        });
        fromContext.mockReturnValue(mockState);

        const element = createElement('c-opportunities-summary', {
            is: OpportunitiesSummary
        });

        document.body.appendChild(element);
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
