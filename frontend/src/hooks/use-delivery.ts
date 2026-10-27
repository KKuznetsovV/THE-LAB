import { createContext, useContext, useMemo, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { selectSettings } from '../redux/settings-slice';

export type DeliveryChoice = { id: 'beecomm' | 'wolt'; url: string };

export type DeliveryValue = {
  providers: DeliveryChoice[];
  sheetOpen: boolean;
  closeSheet: () => void;
  order: () => void;
};

export const DeliveryContext = createContext<DeliveryValue | null>(null);

export function useDeliveryState(): DeliveryValue {
  const [sheetOpen, setSheetOpen] = useState(false);
  const settings = useAppSelector(selectSettings);
  const providers = useMemo(() => {
    const list: DeliveryChoice[] = [];
    if (settings.deliveryUrl) list.push({ id: 'beecomm', url: settings.deliveryUrl });
    if (settings.woltUrl) list.push({ id: 'wolt', url: settings.woltUrl });
    return list;
  }, [settings.deliveryUrl, settings.woltUrl]);

  function order(): void {
    const only = providers[0];
    if (providers.length === 1 && only) {
      window.open(only.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (providers.length > 1) setSheetOpen(true);
  }

  return {
    providers,
    sheetOpen,
    closeSheet: () => setSheetOpen(false),
    order,
  };
}

export function useDelivery(): DeliveryValue {
  const value = useContext(DeliveryContext);
  if (!value) throw new Error('DeliveryProvider is missing');
  return value;
}
