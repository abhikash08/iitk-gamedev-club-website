import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import { fetchCsv } from '../utils/csv';
import { getGamePlayerRoute, normalizeGameBuildPath } from '../utils/games';
import { getImagePath } from '../utils/paths';

const genreOrder = [
  'Action',
  'Adventure',
  'Puzzle',
  'Platformer',
  'Shooter',
  'Racing',
  'RPG',
  'Survival',
  'Arcade',
  'Multiplayer',
  'Simulation',
  'VR',
];

const genreMatchers = [
  { genre: 'Action', patterns: ['action', 'combat', 'fight', 'fighting'] },
  { genre: 'Adventure', patterns: ['adventure', 'explore', 'exploration', 'dungeon', 'journey', 'mystery'] },
  { genre: 'Puzzle', patterns: ['puzzle'] },
  { genre: 'Platformer', patterns: ['platformer', 'runner', 'jump'] },
  { genre: 'Shooter', patterns: ['shooter', 'shoot', 'turret', 'projectile', 'gun'] },
  { genre: 'Racing', patterns: ['racing', 'drift', 'car'] },
  { genre: 'RPG', patterns: ['role playing', 'rpg'] },
  { genre: 'Survival', patterns: ['survive', 'survival'] },
  { genre: 'Arcade', patterns: ['arcade', 'pinball', 'chaos', 'quick draw'] },
  { genre: 'Multiplayer', patterns: ['two player', 'online', 'multiplayer'] },
  { genre: 'Simulation', patterns: ['simulation', 'simulator'] },
  { genre: 'VR', patterns: ['vr', 'virtual reality'] },
];

const splitGenres = (value = '') =>
  value
    .split(/[|,/]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const normalizeGenreName = (genre) => {
  const compact = genre.replace(/\s+/g, ' ').trim();
  const lower = compact.toLowerCase();

  if (lower === 'role playing') return 'RPG';
  if (lower === 'virtual reality') return 'VR';
  if (lower === 'multiplayer') return 'Multiplayer';

  return compact.charAt(0).toUpperCase() + compact.slice(1).toLowerCase();
};

const inferGenres = (game) => {
  const explicitGenres = splitGenres(game.genres).map(normalizeGenreName);
  if (explicitGenres.length) {
    return [...new Set(explicitGenres)];
  }

  const source = `${game.title} ${game.description}`.toLowerCase();
  const inferredGenres = genreMatchers.filter(({ patterns }) => patterns.some((pattern) => source.includes(pattern))).map(({ genre }) => genre);

  if (!inferredGenres.length) {
    inferredGenres.push('Adventure');
  }

  return [...new Set(inferredGenres)];
};

const normalizeGame = (game) => ({
  ...game,
  image: getImagePath(game.image || '/images/project-cello.svg'),
  play: normalizeGameBuildPath(game.play),
  playerRoute: getGamePlayerRoute(game.play),
  genres: inferGenres(game),
});

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    fetchCsv('/data/games.csv')
      .then((rows) => setGames(rows.map(normalizeGame)))
      .catch((error) => console.error(error));
  }, []);

  const availableGenres = useMemo(() => {
    const discoveredGenres = [...new Set(games.flatMap((game) => game.genres || []))];
    return [...genreOrder.filter((genre) => discoveredGenres.includes(genre)), ...discoveredGenres.filter((genre) => !genreOrder.includes(genre)).sort()];
  }, [games]);

  const filteredGames = useMemo(() => {
    if (!selectedGenres.length) {
      return games;
    }

    return games.filter((game) => selectedGenres.every((genre) => game.genres.includes(genre)));
  }, [games, selectedGenres]);

  const toggleGenre = (genre) => {
    setSelectedGenres((current) => (current.includes(genre) ? current.filter((entry) => entry !== genre) : [...current, genre]));
  };

  return (
    <div>
      <SectionHeader title="Club Games" />

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {availableGenres.map((genre) => {
            const active = selectedGenres.includes(genre);

            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.16em] transition ${
                  active
                    ? 'border-accent bg-ink/90 text-accent shadow-[0_0_18px_rgba(181,159,119,0.18)] backdrop-blur-md'
                    : 'border-white/20 bg-ink/85 text-slate-200 backdrop-blur-md hover:border-accent2/45 hover:bg-ink/95 hover:text-white'
                }`}
              >
                {genre}
              </button>
            );
          })}

          {selectedGenres.length ? (
            <button
              type="button"
              onClick={() => setSelectedGenres([])}
              className="rounded-full border border-white/20 bg-ink/85 px-4 py-2 text-sm uppercase tracking-[0.16em] text-slate-300 backdrop-blur-md transition hover:border-white/35 hover:bg-ink/95 hover:text-white"
            >
              Clear Filters
            </button>
          ) : null}
        </div>

        <p className="text-base text-slate-400">
          Showing {filteredGames.length} game{filteredGames.length === 1 ? '' : 's'}
          {selectedGenres.length ? ` for ${selectedGenres.join(', ')}` : ''}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredGames.map((game) => (
          <Card key={game.title}>
            <img src={game.image} alt={game.title} loading="lazy" className="mb-4 h-48 w-full rounded-xl object-cover" />
            <div className="mb-3 flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <span key={`${game.title}-${genre}`} className="rounded-full border border-accent2/25 bg-accent2/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-accent2">
                  {genre}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-semibold">{game.title}</h3>
            <p className="mt-2 text-base text-slate-300">{game.description}</p>
            <div className="mt-4 flex gap-3">
              {game.github ? (
                <a href={game.github} target="_blank" rel="noreferrer" className="btn-secondary text-base">
                  GitHub
                </a>
              ) : null}
              {game.playerRoute ? (
                <Link to={game.playerRoute} className="btn-primary text-base">
                  Play
                </Link>
              ) : game.play ? (
                <a href={game.play} target="_blank" rel="noreferrer" className="btn-primary text-base">
                  Play
                </a>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;


