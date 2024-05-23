import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

// Mock values that are not part of the lightning/platformWorkspaceApi signature
// In this default test scenario, we assume that two tabs are open, and the first one is focused
export const TAB0 = 'tab0';
export const TAB1 = 'tab1';
export const FOCUSED_TAB_ID = TAB0;
export const ENCLOSING_TAB_ID = TAB0;
export const OPEN_TABS = [{ tabId: TAB0 }, { tabId: TAB1 }];

// Mocked methods and wires that are part of the lightning/platformWorkspaceApi signature
export const closeTab = jest.fn().mockResolvedValue(true);
export const disableTabClose = jest.fn().mockResolvedValue(true);
export const focusTab = jest.fn().mockResolvedValue(true);
export const getAllTabInfo = jest.fn().mockResolvedValue(OPEN_TABS);
export const getFocusedTabInfo = jest.fn().mockResolvedValue({ tabId: TAB0 });
export const getTabInfo = jest.fn().mockResolvedValue({ tabId: TAB0 });
export const openSubtab = jest.fn().mockResolvedValue(true);
export const openTab = jest.fn().mockResolvedValue(true);
export const refreshTab = jest.fn().mockResolvedValue(true);
export const setTabIcon = jest.fn().mockResolvedValue(true);
export const setTabLabel = jest.fn().mockResolvedValue(true);
export const setTabHighlighted = jest.fn().mockResolvedValue(true);

export const EnclosingTabId = createTestWireAdapter(jest.fn());
export const IsConsoleNavigation = createTestWireAdapter(jest.fn());
