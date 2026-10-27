import { useParams } from 'react-router-dom';
import './Events.css';

export default function Events() {
  const { slug } = useParams();
  return (
    <section className="events">
      <h1>{slug ? `Events · ${slug}` : 'Events'}</h1>
    </section>
  );
}
