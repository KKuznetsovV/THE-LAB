import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../redux/hooks';
import { selectSettings } from '../../../redux/settings-slice';
import { telHref } from '../../../utils/site-defaults';
import PageMeta from '../../seo/PageMeta';
import './Accessibility.css';

export default function Accessibility() {
  const { t, i18n } = useTranslation();
  const settings = useAppSelector(selectSettings);
  const name = settings.accessibilityCoordinatorName;
  const phone = settings.accessibilityCoordinatorPhone || settings.phone;
  const email = settings.accessibilityCoordinatorEmail;
  const auditDate = settings.lastAccessibilityAudit ? new Date(settings.lastAccessibilityAudit) : null;
  const auditLabel = auditDate && !Number.isNaN(auditDate.getTime())
    ? t('legal.audit', {
      date: new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-GB' : 'he-IL', {
        timeZone: 'Asia/Jerusalem',
        dateStyle: 'long',
      }).format(auditDate),
    })
    : t('legal.auditMissing');

  return (
    <article className="accessibility">
      <PageMeta title={`${t('legal.accessibilityTitle')} · THE LAB`} description={t('seo.accessibility')} path="/accessibility" />
      <h1>{t('legal.accessibilityHeading')}</h1>
      <p>{t('legal.standard')}</p>
      <p>{t('legal.done')}</p>
      <p>{t('legal.limits')}</p>
      <section>
        <h2>{t('legal.coordinator')}</h2>
        {name ? <p>{name}</p> : null}
        {phone ? <p><a href={telHref(phone)}>{phone}</a></p> : null}
        {email ? <p><a href={`mailto:${email}`}>{email}</a></p> : null}
        <p>{auditLabel}</p>
      </section>
      <section>
        <h2>{t('legal.report')}</h2>
        <p>{t('legal.reportBody')}</p>
      </section>
    </article>
  );
}
