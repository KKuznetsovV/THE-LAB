import './SectionHeader.css';

type Props = {
  kicker: string;
  title: string;
  subtitle?: string;
  titleLang?: string;
  titleDir?: 'ltr' | 'rtl';
  japanese?: string;
};

export default function SectionHeader({ kicker, title, subtitle, titleLang, titleDir, japanese }: Props) {
  return (
    <header className="section-header">
      <p className="section-header-kicker t-mono">{kicker}</p>
      <h2 className="section-header-title" lang={titleLang} dir={titleDir}>{title}</h2>
      {subtitle ? <p className="section-header-sub">{subtitle}</p> : null}
      {japanese ? (
        <p className="section-header-ja t-pixel" lang="ja" aria-hidden="true">{japanese}</p>
      ) : null}
    </header>
  );
}
