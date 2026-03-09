import { createElement } from '@lwc/engine-dom';
import { fromContext } from '@lwc/state';
import { stateManagerInstanceMock } from '@lwc/state-test-utils';
import OpportunitiesList from 'c/opportunitiesList';

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

describe('c-opportunities-list', () => {
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

        const element = createElement('c-opportunities-list', {
            is: OpportunitiesList
        });

        document.body.appendChild(element);
        await flushPromises();

        const dataTable = element.shadowRoot.querySelector(
            'lightning-datatable'
        );
        expect(dataTable.data.length).toBe(0);
    });

    it('renders correctly after state manager updates with data', async () => {
        const mockState = stateManagerInstanceMock({
            opportunities: [],
            totalAmount: 0
        });
        fromContext.mockReturnValue(mockState);

        const element = createElement('c-opportunities-list', {
            is: OpportunitiesList
        });

        document.body.appendChild(element);
        await flushPromises();

        mockState.updateValue({
            opportunities: [
                {
                    Id: '1',
                    Name: 'Opportunity 1',
                    StageName: 'Prospecting',
                    Amount: { value: 1000 }
                },
                {
                    Id: '2',
                    Name: 'Opportunity 2',
                    StageName: 'Qualification',
                    Amount: { value: 2000 }
                },
                {
                    Id: '3',
                    Name: 'Opportunity 3',
                    StageName: 'Proposal',
                    Amount: { value: 3000 }
                }
            ],
            totalAmount: 6000
        });

        await flushPromises();

        const dataTable = element.shadowRoot.querySelector(
            'lightning-datatable'
        );
        expect(dataTable.data.length).toBe(3);
        expect(dataTable.data[0].amount).toBe(1000);
        expect(dataTable.data[1].amount).toBe(2000);
        expect(dataTable.data[2].amount).toBe(3000);
    });

    it('is accessible', async () => {
        const mockState = stateManagerInstanceMock({
            opportunities: [
                {
                    Id: '1',
                    Name: 'Opportunity 1',
                    StageName: 'Prospecting',
                    Amount: { value: 1000 }
                },
                {
                    Id: '2',
                    Name: 'Opportunity 2',
                    StageName: 'Qualification',
                    Amount: { value: 2000 }
                },
                {
                    Id: '3',
                    Name: 'Opportunity 3',
                    StageName: 'Proposal',
                    Amount: { value: 3000 }
                }
            ],
            totalAmount: 6000
        });
        fromContext.mockReturnValue(mockState);

        const element = createElement('c-opportunities-list', {
            is: OpportunitiesList
        });

        document.body.appendChild(element);
        await flushPromises();

        await expect(element).toBeAccessible();
    });
});
