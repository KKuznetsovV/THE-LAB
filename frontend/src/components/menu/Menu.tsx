import { useParams } from 'react-router-dom';
import './Menu.css';

export default function Menu() {
  const { code } = useParams();
  return (
    <section className="menu">
      <h1>{code ? `Menu · ${code}` : 'Menu'}</h1>
    </section>
  );
}
