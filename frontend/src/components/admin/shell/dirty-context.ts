import { createContext, useContext } from 'react';

export type DirtyValue = {
  setDirty: (value: boolean) => void;
  requestLeave: (go: () => void) => void;
};

export const DirtyContext = createContext<DirtyValue | null>(null);

export function useFormDirty(): DirtyValue {
  const value = useContext(DirtyContext);
  if (!value) throw new Error('dirty guard missing');
  return value;
}
