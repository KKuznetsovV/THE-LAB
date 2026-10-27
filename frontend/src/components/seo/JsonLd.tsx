import type { OpeningHoursDto } from '@thelab/lib';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../redux/hooks';
import { selectHours, selectSettings } from '../../redux/settings-slice';
import { absoluteUrl } from '../../utils/site-origin';

/**
 * Ahad Ha'am 1, Neve Tzedek. The printed node address adds a leading 1
 * (`132.06325 : 134.76801`) and is not a WGS84 coordinate.
 */
const GEO = { latitude: 32.06325, longitude: 34.76801 };

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

function clock(value: string): string {
  return value.slice(0, 5);
}

function jsonScript(data: unknown) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

function hoursSpec(hours: OpeningHoursDto[]) {
  return hours
    .filter((day) => !day.isClosed && DAY[day.dayOfWeek])
    .map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY[day.dayOfWeek],
      opens: clock(day.opensAt),
      closes: clock(day.closesAt),
    }));
}

export function VenueJsonLd() {
  const { i18n } = useTranslation();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const address = i18n.language === 'en' ? settings.addressEn : settings.addressHe;
  const sameAs = settings.instagramUrl.trim() ? [settings.instagramUrl.trim()] : [];
  return jsonScript({
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: 'THE LAB',
    url: absoluteUrl('/'),
    telephone: settings.phone,
    servesCuisine: 'Cocktails',
    acceptsReservations: settings.reservationUrl.trim().length > 0,
    hasMenu: absoluteUrl('/menu'),
    image: `${absoluteUrl('/og/the-lab.png')}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Tel Aviv-Yafo',
      addressCountry: 'IL',
    },
    geo: { '@type': 'GeoCoordinates', ...GEO },
    openingHoursSpecification: hoursSpec(hours),
    sameAs,
  });
}

type EventProps = {
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  url: string;
  image: string | null;
};

export function EventJsonLd({ name, description, startDate, endDate, url, image }: EventProps) {
  const settings = useAppSelector(selectSettings);
  return jsonScript({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate ? { endDate } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url,
    ...(image ? { image } : {}),
    location: {
      '@type': 'BarOrPub',
      name: 'THE LAB',
      address: settings.addressEn,
      telephone: settings.phone,
    },
  });
}
