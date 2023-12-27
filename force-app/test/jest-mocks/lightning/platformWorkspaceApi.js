import { createTestWireAdapter } from '@salesforce/wire-service-jest-util';

export const mockCloseTab = jest.fn();
export const mockDisableTabClose = jest.fn();
export const mockFocusTab = jest.fn();
export const mockGetAllTabInfo = jest.fn();
export const mockGetFocusedTabInfo = jest.fn();
export const mockGetTabInfo = jest.fn();
export const mockOpenSubtab = jest.fn();
export const mockOpenTab = jest.fn();
export const mockRefreshTab = jest.fn();
export const mockSetTabHighlighted = jest.fn();
export const mockSetTabIcon = jest.fn();
export const mockSetTabLabel = jest.fn();

export const EnclosingTabId = createTestWireAdapter(jest.fn());
export const IsConsoleNavigation = createTestWireAdapter(jest.fn());
