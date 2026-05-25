import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import ScrollReveal from '../components/ScrollReveal';
import { fetchCsv } from '../utils/csv';
import { getImagePath } from '../utils/paths';

const winningGameTitles = new Set(['cell - o', 'cell-o', 'ignition evade']);

const normalizeGame = (game) => ({
  ...game,
  image: getImagePath(game.image || ''),
});

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([fetchCsv('/data/games.csv'), fetchCsv('/data/events.csv')])
      .then(([gameRows, eventRows]) => {
        const winningGames = gameRows
          .filter((game) => winningGameTitles.has(game.title.toLowerCase()))
          .map(normalizeGame);
        setGames(winningGames);
        setEvents(eventRows);
      })
      .catch((error) => console.error(error));
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events]);

  return (
    <div className="space-y-14">
      <ScrollReveal
        as="section"
        className="hero-console rounded-[2rem] border border-white/10 px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[78vh] lg:px-10 lg:py-14"
        distance={34}
      >
        <div className="relative z-10 flex min-h-[65vh] max-w-5xl flex-col justify-center">
          <h1 className="max-w-5xl text-[1.7rem] font-semibold uppercase leading-[1.02] tracking-[0.04em] text-white sm:text-[3.35rem] lg:text-[5.1rem]">
            <span className="block sm:inline">Game </span>
            <span className="block sm:inline">Development </span>
            <span className="block sm:inline">Club</span>
          </h1>

          <p className="mt-5 text-[1.15rem] uppercase tracking-[0.18em] text-slate-300 sm:text-[1.55rem] lg:text-[1.8rem]">IIT Kanpur</p>

          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-400 sm:text-base lg:text-lg">Learn. Play. Create.</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/games" className="btn-primary rounded-md px-6 py-4 text-lg uppercase tracking-[0.12em]">
              Explore Games
            </Link>
            <Link to="/learning" className="btn-secondary rounded-md px-6 py-4 text-lg uppercase tracking-[0.12em]">
              Start Learning
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" id="about-us" className="scroll-mt-28" distance={26}>
        <h2 className="mb-5 text-2xl font-semibold">About Us</h2>
        <Card className="space-y-5 text-slate-300 hover:translate-y-0 hover:border-white/10 hover:shadow-lg">
          <p>
            The Game Development Club at IIT Kanpur began as a Stamatics computer graphics project, driven by a small
            group of students interested in graphics and interactive systems. Over time, this initiative evolved into
            a full-fledged club, with its first official session as a society held in January 2020, marking the
            beginning of a more structured and growing community around game development.
          </p>
          <p>
            Since then, the club has expanded significantly, both in scope and participation. From focusing primarily
            on graphics, it has grown into a multidisciplinary space covering game design, programming, art,
            animation, AI, and storytelling. On November 9, 2022, the club further strengthened its identity within
            the institute ecosystem, establishing itself as a key hub for creative and technical collaboration.
          </p>
          <p>
            The club regularly conducts workshops, bootcamps, and game jams, enabling students to learn by building
            and experimenting. Members actively participate in national and international game jams and represent IIT
            Kanpur at platforms like the Inter-IIT Tech Meet, where the club has consistently performed well.
            Notably, the club secured 2nd Runner-Up positions twice, with Ignition Evade at Inter-IIT Tech Meet 12.0
            and Cell-O at Inter-IIT Tech Meet 14.0, reflecting its strong development and teamwork.
          </p>
          <p>
            Today, the club is moving beyond traditional game development into areas such as AR, VR, and interactive
            simulations, reflecting both industry trends and research directions. By fostering collaboration across
            disciplines and encouraging hands-on creation, the Game Development Club aims to provide a space where
            students can explore, innovate, and build meaningful interactive experiences.
          </p>
        </Card>
      </ScrollReveal>

      <ScrollReveal as="section" distance={24}>
        <h2 className="mb-5 text-2xl font-semibold">Inter IIT Podium Finishers</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {games.map((game, index) => (
            <ScrollReveal key={game.title} delay={index * 110} distance={24}>
              <Card>
                {game.image ? <img src={game.image} alt={game.title} loading="lazy" className="mb-4 h-44 w-full rounded-xl object-cover" /> : null}
                <h3 className="text-xl font-semibold">{game.title}</h3>
                {game.description ? <p className="mt-2 text-base text-slate-300">{game.description}</p> : null}
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" distance={24}>
        <h2 className="mb-5 text-2xl font-semibold">Upcoming Events</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <ScrollReveal key={`${event.title}-${event.date}`} delay={index * 90} distance={22}>
              <Card>
                <p className="text-base text-accent">{new Date(event.date).toDateString()}</p>
                <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
                <p className="mt-2 text-base text-slate-300">{event.description}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" distance={24}>
        <h2 className="mb-5 text-2xl font-semibold">Quick Links to Learning Roadmaps</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {['Unity', 'Godot', 'AR/VR', 'Rendering', 'Game Art', 'Sound Design'].map((track, index) => (
            <ScrollReveal key={track} delay={index * 70} distance={20}>
              <Link to="/learning" className="card block text-center text-lg font-semibold">
                {track}
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HomePage;

