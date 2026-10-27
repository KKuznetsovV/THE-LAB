import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../redux/hooks';
import { loadBottles, loadEvents, loadMenu } from '../../redux/collections';
import PageMeta from '../seo/PageMeta';
import { VenueJsonLd } from '../seo/JsonLd';
import BottlesTeaser from './bottles-teaser/BottlesTeaser';
import Concept from './concept/Concept';
import EventsTeaser from './events-teaser/EventsTeaser';
import Hero from './hero/Hero';
import InstagramTeaser from './instagram-teaser/InstagramTeaser';
import MenuTeaser from './menu-teaser/MenuTeaser';
import VisitTeaser from './visit-teaser/VisitTeaser';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadMenu());
    void dispatch(loadBottles());
    void dispatch(loadEvents());
  }, [dispatch]);

  return (
    <div className="home">
      <PageMeta title="THE LAB · TLV" description={t('seo.home')} path="/" />
      <VenueJsonLd />
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
