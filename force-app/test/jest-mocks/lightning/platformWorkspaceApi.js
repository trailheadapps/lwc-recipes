import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

// Mock values that are not part of lightning/platformWorkspaceApi
export const TAB0 = 'tab0';
export const TAB1 = 'tab1';
// In our mock, we assume that two tabs are open, and the first one is focused
export const FOCUSED_TAB_ID = TAB0;
export const ENCLOSING_TAB_ID = TAB0;

// Mocked methods and attributes from lightning/platformWorkspaceApi
export const closeTab = jest.fn().mockResolvedValue(true);
export const disableTabClose = jest.fn().mockResolvedValue(true);
export const focusTab = jest.fn().mockResolvedValue(true);
export const getAllTabInfo = jest
    .fn()
    .mockResolvedValue([{ tabId: TAB0 }, { tabId: 'tab1' }]);
export const getFocusedTabInfo = jest.fn().mockResolvedValue({ tabId: TAB0 });
export const getTabInfo = jest.fn().mockResolvedValue({ tabId: TAB0 });
export const openSubtab = jest.fn().mockResolvedValue(true);
export const openTab = jest.fn().mockResolvedValue(true);
export const refreshTab = jest.fn().mockResolvedValue(true);
export const setTabHighlighted = jest.fn().mockResolvedValue(true);
export const setTabIcon = jest.fn().mockResolvedValue(true);
export const setTabLabel = jest.fn().mockResolvedValue(true);

export const EnclosingTabId = createTestWireAdapter(jest.fn());
export const IsConsoleNavigation = createTestWireAdapter(jest.fn());
