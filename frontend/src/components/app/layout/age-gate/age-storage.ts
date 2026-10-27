const STORAGE_KEY = 'thelab-age-ok';

export function ageGateInitiallyBlocked(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'yes';
  } catch {
    return true;
  }
}

export function storeAgeConsent(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'yes');
  } catch {
    // The gate still closes for this visit.
  }
}
