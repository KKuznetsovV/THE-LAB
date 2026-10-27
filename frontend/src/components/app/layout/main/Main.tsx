import { Route, Routes } from 'react-router-dom';
import About from '../../../about/About';
import Archive from '../../../archive/Archive';
import Events from '../../../events/Events';
import Home from '../../../home/Home';
import Accessibility from '../../../legal/accessibility/Accessibility';
import Privacy from '../../../legal/privacy/Privacy';
import Menu from '../../../menu/Menu';
import TakeMeHome from '../../../take-me-home/TakeMeHome';
import Visit from '../../../visit/Visit';
import NotFound from '../not-found/NotFound';

export default function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/menu/:code" element={<Menu />} />
      <Route path="/take-me-home" element={<TakeMeHome />} />
      <Route path="/visit" element={<Visit />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<Events />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/about" element={<About />} />
      <Route path="/accessibility" element={<Accessibility />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
