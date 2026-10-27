import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BottleDto, CocktailDto, EventDto, GalleryImageDto, SpiritGroupDto } from '@thelab/lib';
import { contentService } from '../services/public/ContentService';
import { getErrorMessage } from '../utils/errors';
import type { LoadStatus } from './settings-slice';

export type ListState<T> = {
  items: T[];
  status: LoadStatus;
  error: string | null;
};

type Force = { force?: boolean } | undefined;

function listSlice<T>(name: string, load: () => Promise<T[]>) {
  const thunk = createAsyncThunk<T[], Force, { rejectValue: string }>(
    `${name}/load`,
    async (_arg, api) => {
      try {
        return await load();
      } catch (error) {
        return api.rejectWithValue(getErrorMessage(error));
      }
    },
    {
      condition: (arg, api) => {
        const root = api.getState() as Record<string, ListState<T>>;
        const status = root[name]?.status;
        if (arg?.force) return status !== 'loading';
        return status === 'idle';
      },
    },
  );

  const slice = createSlice({
    name,
    initialState: { items: [], status: 'idle', error: null } as ListState<T>,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action: PayloadAction<T[]>) => {
          state.status = 'ready';
          state.items = action.payload as typeof state.items;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = 'error';
          state.error = action.payload ?? getErrorMessage(action.error);
        });
    },
  });

  return { reducer: slice.reducer, load: thunk };
}

const menu = listSlice<CocktailDto>('menu', () => contentService.getCocktails());
const bottles = listSlice<BottleDto>('bottles', () => contentService.getBottles());
const events = listSlice<EventDto>('events', () => contentService.getEvents('upcoming'));
const gallery = listSlice<GalleryImageDto>('gallery', () => contentService.getGallery());
const spirits = listSlice<SpiritGroupDto>('spirits', () => contentService.getSpirits());

export const menuReducer = menu.reducer;
export const loadMenu = menu.load;
export const bottlesReducer = bottles.reducer;
export const loadBottles = bottles.load;
export const eventsReducer = events.reducer;
export const loadEvents = events.load;
export const galleryReducer = gallery.reducer;
export const loadGallery = gallery.load;
export const spiritsReducer = spirits.reducer;
export const loadSpirits = spirits.load;

export function selectMenu(state: { menu: ListState<CocktailDto> }): ListState<CocktailDto> {
  return state.menu;
}

export function selectBottles(state: { bottles: ListState<BottleDto> }): ListState<BottleDto> {
  return state.bottles;
}

export function selectEvents(state: { events: ListState<EventDto> }): ListState<EventDto> {
  return state.events;
}

export function selectGallery(state: { gallery: ListState<GalleryImageDto> }): ListState<GalleryImageDto> {
  return state.gallery;
}

export function selectSpirits(state: { spirits: ListState<SpiritGroupDto> }): ListState<SpiritGroupDto> {
  return state.spirits;
}
