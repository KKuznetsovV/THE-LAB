let dirty = false;

export function setFormDirty(value: boolean): void {
  dirty = value;
}

export function formIsDirty(): boolean {
  return dirty;
}
