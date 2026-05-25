import { useEffect, useState } from 'react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import { fetchCsv } from '../utils/csv';
import { getImagePath } from '../utils/paths';

const RenderMondaysPage = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchCsv('/data/rendermondays.csv')
      .then((entries) => setEntries(entries.map((entry) => ({ ...entry, image: getImagePath(entry.image) }))))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <SectionHeader
        title="RenderMondays"
        subtitle="Weekly visual experiments and artwork from the club."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Card key={`${entry.week}-${entry.title}`}>
            <img src={entry.image} alt={entry.title} loading="lazy" className="mb-4 h-48 w-full rounded-xl object-cover" />
            <p className="text-sm text-accent">Week {entry.week}</p>
            <h3 className="mt-1 text-lg font-semibold">{entry.title}</h3>
            <p className="text-sm text-slate-300">Artist: {entry.artist}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RenderMondaysPage;