import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { OpeningHoursDto, SiteSettingsDto } from '@thelab/lib';
import { contentService } from '../services/public/ContentService';
import { getErrorMessage } from '../utils/errors';
import { fallbackHours, fallbackSettings } from '../utils/site-defaults';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

type SettingsState = {
  settings: SiteSettingsDto | null;
  hours: OpeningHoursDto[] | null;
  status: LoadStatus;
  error: string | null;
};

const initialState: SettingsState = {
  settings: null,
  hours: null,
  status: 'idle',
  error: null,
};

export const loadSite = createAsyncThunk('settings/load', async (arg?: { force?: boolean }) => {
  const [settings, hours] = await Promise.all([
    contentService.getSettings(),
    contentService.getHours(),
  ]);
  return { settings, hours, force: arg?.force === true };
}, {
  condition: (arg, api) => {
    const status = (api.getState() as { settings: SettingsState }).settings.status;
    if (arg?.force) return status !== 'loading';
    return status === 'idle';
  },
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSite.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadSite.fulfilled, (state, action) => {
        state.status = 'ready';
        state.settings = action.payload.settings;
        state.hours = action.payload.hours;
      })
      .addCase(loadSite.rejected, (state, action) => {
        state.status = 'error';
        state.error = getErrorMessage(action.error);
      });
  },
});

export default settingsSlice.reducer;

export function selectSettings(state: { settings: SettingsState }): SiteSettingsDto {
  return state.settings.settings ?? fallbackSettings;
}

export function selectHours(state: { settings: SettingsState }): OpeningHoursDto[] {
  return state.settings.hours ?? fallbackHours;
}

export function selectSettingsStatus(state: { settings: SettingsState }): LoadStatus {
  return state.settings.status;
}
