import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import { sponsors } from '../utils/content';
import { getImagePath } from '../utils/paths';

const SponsorsPage = () => {
  return (
    <div>
      <SectionHeader title="Sponsors" subtitle="Organizations that support our student builders and events." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sponsors.map(([name, href]) => (
          <Card key={name} className="flex items-center justify-between">
            <img src={getImagePath('/images/logo-placeholder.svg')} alt={name} loading="lazy" className="h-10 w-10" />
            <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-slate-200 hover:text-accent">
              {name}
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SponsorsPage;