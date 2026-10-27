import { loadBottles, loadEvents, loadGallery, loadMenu, loadPastEvents, loadSpirits } from '../../redux/collections';
import type { AppDispatch } from '../../redux/store';
import { loadSite } from '../../redux/settings-slice';

export type PublicSlice = 'menu' | 'bottles' | 'spirits' | 'events' | 'gallery' | 'site';

export function refreshPublic(dispatch: AppDispatch, kind: PublicSlice): void {
  if (kind === 'menu') void dispatch(loadMenu({ force: true }));
  if (kind === 'bottles') void dispatch(loadBottles({ force: true }));
  if (kind === 'spirits') void dispatch(loadSpirits({ force: true }));
  if (kind === 'events') {
    void dispatch(loadEvents({ force: true }));
    void dispatch(loadPastEvents({ force: true }));
  }
  if (kind === 'gallery') void dispatch(loadGallery({ force: true }));
  if (kind === 'site') void dispatch(loadSite({ force: true }));
}
