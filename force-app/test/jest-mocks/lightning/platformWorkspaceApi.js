import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

// This mock assumes two tabs are open, and the first one is focused
export const FOCUSED_TAB = 'tab0';
export const ENCLOSING_TAB_ID = 'tab0';
export const closeTab = jest.fn().mockResolvedValue(true);
export const disableTabClose = jest.fn().mockResolvedValue(true);
export const focusTab = jest.fn().mockResolvedValue(true);
export const getAllTabInfo = jest
    .fn()
    .mockResolvedValue([{ tabId: 'tab0' }, { tabId: 'tab1' }]);
export const getFocusedTabInfo = jest.fn().mockResolvedValue({ tabId: 'tab0' });
export const getTabInfo = jest.fn().mockResolvedValue({ tabId: 'tab0' });
export const openSubtab = jest.fn().mockResolvedValue(true);
export const openTab = jest.fn().mockResolvedValue(true);
export const refreshTab = jest.fn().mockResolvedValue(true);
export const setTabHighlighted = jest.fn().mockResolvedValue(true);
export const setTabIcon = jest.fn().mockResolvedValue(true);
export const setTabLabel = jest.fn().mockResolvedValue(true);

export const EnclosingTabId = createTestWireAdapter(jest.fn());
export const IsConsoleNavigation = createTestWireAdapter(jest.fn());
