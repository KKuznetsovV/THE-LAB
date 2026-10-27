import './SectionHeader.css';

type Props = {
  kicker: string;
  title: string;
  japanese?: string;
};

export default function SectionHeader({ kicker, title, japanese }: Props) {
  return (
    <header className="section-header">
      <p className="section-header-kicker t-mono">{kicker}</p>
      <h2 className="section-header-title">{title}</h2>
      {japanese ? (
        <p className="section-header-ja t-pixel" lang="ja" aria-hidden="true">{japanese}</p>
      ) : null}
    </header>
  );
}
