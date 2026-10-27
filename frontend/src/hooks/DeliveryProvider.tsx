import type { ReactNode } from 'react';
import { DeliveryContext, useDeliveryState } from './use-delivery';

export default function DeliveryProvider({ children }: { children: ReactNode }) {
  const value = useDeliveryState();
  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
}
