import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { loadBottles, loadEvents, loadMenu } from '../../redux/collections';
import BottlesTeaser from './bottles-teaser/BottlesTeaser';
import Concept from './concept/Concept';
import EventsTeaser from './events-teaser/EventsTeaser';
import Hero from './hero/Hero';
import InstagramTeaser from './instagram-teaser/InstagramTeaser';
import MenuTeaser from './menu-teaser/MenuTeaser';
import VisitTeaser from './visit-teaser/VisitTeaser';
import './Home.css';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadMenu());
    void dispatch(loadBottles());
    void dispatch(loadEvents());
  }, [dispatch]);

  return (
    <div className="home">
      <title>THE LAB · TLV</title>
      <h1 className="visually-hidden">THE LAB</h1>
      <Hero />
      <div className="home-sections">
        <Concept />
        <MenuTeaser />
        <BottlesTeaser />
        <EventsTeaser />
        <VisitTeaser />
        <InstagramTeaser />
      </div>
    </div>
  );
}
