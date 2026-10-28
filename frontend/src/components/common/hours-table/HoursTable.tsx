import type { OpeningHoursDto } from '@thelab/lib';
import Ltr from '../ltr/Ltr';
import './HoursTable.css';

type Props = {
  hours: OpeningHoursDto[];
  locale: string;
  caption: string;
  closedLabel: string;
  todayLabel: string;
  today: number;
};

const DAY_ANCHOR = new Date(Date.UTC(2026, 0, 4));

function dayName(day: number, locale: string): string {
  const date = new Date(DAY_ANCHOR);
  date.setUTCDate(DAY_ANCHOR.getUTCDate() + day);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(date);
}

export default function HoursTable({ hours, locale, caption, closedLabel, todayLabel, today }: Props) {
  return (
    <table className="hours-table">
      <caption className="t-mono">{caption}</caption>
      <tbody>
        {hours.map((row) => (
          <tr key={row.dayOfWeek} className={row.dayOfWeek === today ? 'is-today' : undefined}>
            <th scope="row">
              {dayName(row.dayOfWeek, locale)}
              {row.dayOfWeek === today ? <span className="visually-hidden"> {todayLabel}</span> : null}
            </th>
            <td>{row.isClosed ? closedLabel : <Ltr>{row.opensAt}–{row.closesAt}</Ltr>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
