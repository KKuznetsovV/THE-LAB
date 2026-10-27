import './CrtOverlay.css';

type Props = {
  flicker?: boolean;
};

export default function CrtOverlay({ flicker = true }: Props) {
  const className = flicker ? 'crt crt--flicker' : 'crt';
  return <div className={className} aria-hidden="true" />;
}
