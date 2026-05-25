import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import { fetchCsv } from '../utils/csv';
import { getImagePath } from '../utils/paths';

const EmptyState = ({ message }) => (
  <Card>
    <p className="text-base text-slate-400">{message}</p>
  </Card>
);

const normalizePhotoPath = (photo = '') => getImagePath(photo ? photo.replace(/^\/public/, '') : '/images/team-rohan.svg');

const ContactItem = ({ label, value, href }) => {
  if (!value) {
    return null;
  }

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="text-base text-slate-200 transition hover:text-accent2">
      {label}
    </a>
  ) : (
    <p className="text-base text-slate-200">
      {label}: {value}
    </p>
  );
};

const PersonHoverCard = ({ name, post, photo, linkedin, github, instagram, email, phone, subtitle }) => (
  <Card className="group relative min-h-72 overflow-hidden border-slate-700 bg-panel/90 p-0 hover:-translate-y-1">
    <div className="absolute inset-0">
      <img src={normalizePhotoPath(photo)} alt={name} loading="lazy" className="h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.08),rgba(10,10,11,0.92))]" />
    </div>
    <div className="relative flex h-full min-h-72 flex-col justify-end p-6">
      {subtitle ? <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-300">{subtitle}</p> : null}
      <h3 className="text-2xl font-semibold text-white">{name}</h3>
      <p className="mt-1 text-base uppercase tracking-[0.14em] text-accent">{post}</p>
    </div>
    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/90 p-6 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Connect</p>
      <div className="flex flex-col gap-2">
        <ContactItem label="LinkedIn" value={linkedin} href={linkedin} />
        <ContactItem label="GitHub" value={github} href={github} />
        <ContactItem label="Instagram" value={instagram} href={instagram} />
        <ContactItem label="Email" value={email} href={email ? `mailto:${email}` : ''} />
        {phone ? <p className="text-base text-slate-200">Phone: {phone}</p> : null}
      </div>
    </div>
  </Card>
);

const SecretaryHoverCard = ({ name, post, photo, linkedin, github, instagram, email, open, onToggle }) => {
  const isOpen = open;

  return (
    <button
      type="button"
      onClick={onToggle}
      className="group relative mx-auto aspect-square w-32 overflow-hidden rounded-full border border-slate-700 bg-panel/90 text-left shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-glow sm:w-36 lg:w-40 xl:w-44"
      aria-expanded={isOpen}
      aria-label={`${isOpen ? 'Hide' : 'Show'} contact links for ${name}`}
    >
      <img
        src={normalizePhotoPath(photo)}
        alt={name}
        loading="lazy"
        className={`h-full w-full object-cover transition duration-300 ${(isOpen ? 'scale-105 brightness-50' : '')} group-hover:scale-105 group-hover:brightness-50`}
      />
      <div className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,11,0.08),rgba(10,10,11,0.82))] transition duration-300 ${(isOpen ? 'opacity-90' : '')} group-hover:opacity-90`} />
      <div className={`absolute inset-x-0 bottom-0 z-[1] px-5 pb-6 text-center transition duration-300 ${(isOpen ? 'opacity-0' : '')} group-hover:opacity-0`}>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-accent">{post}</p>
      </div>
      <div className={`absolute inset-0 z-10 flex flex-col items-center justify-end bg-black/40 p-4 text-center transition duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Connect</p>
        <div className="flex flex-col gap-2" onClick={(event) => event.stopPropagation()}>
          <ContactItem label="LinkedIn" value={linkedin} href={linkedin} />
          <ContactItem label="GitHub" value={github} href={github} />
          <ContactItem label="Instagram" value={instagram} href={instagram} />
          <ContactItem label="Email" value={email} href={email ? `mailto:${email}` : ''} />
        </div>
      </div>
    </button>
  );
};

const getTenureStart = (tenure = '') => {
  const match = tenure.match(/(\d{4})/);
  return match ? Number(match[1]) : 0;
};

const TeamPage = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [secretaries, setSecretaries] = useState([]);
  const [pastCoordinators, setPastCoordinators] = useState([]);
  const [openSecretary, setOpenSecretary] = useState('');

  useEffect(() => {
    fetchCsv('/data/team.csv')
      .then(setCoordinators)
      .catch((error) => console.error(error));

    fetchCsv('/data/secretaries.csv')
      .then(setSecretaries)
      .catch((error) => console.error(error));

    fetchCsv('/data/past-coordinators.csv')
      .then(setPastCoordinators)
      .catch((error) => console.error(error));
  }, []);

  const groupedPastCoordinators = useMemo(() => {
    const groups = pastCoordinators.reduce((accumulator, member) => {
      const key = member.tenure || 'Unknown';
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(member);
      return accumulator;
    }, {});

    return Object.entries(groups).sort((a, b) => getTenureStart(b[0]) - getTenureStart(a[0]));
  }, [pastCoordinators]);

  return (
    <div className="space-y-12 pt-2">
      <section>
        <h2 className="mb-5 text-2xl font-semibold">Current Coordinators</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coordinators.map((member) => (
            <PersonHoverCard
              key={member.name}
              name={member.name}
              post={member.role}
              photo={member.photo}
              linkedin={member.linkedin}
              github={member.github}
              instagram={member.instagram}
              email={member.email}
              phone={member.phone}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Secretaries</h2>
        {secretaries.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {secretaries.map((secretary) => (
              <SecretaryHoverCard
                key={secretary.name}
                name={secretary.name}
                post={secretary.role}
                photo={secretary.photo}
                linkedin={secretary.linkedin}
                github={secretary.github}
                instagram={secretary.instagram}
                email={secretary.email}
                open={openSecretary === secretary.name}
                onToggle={() => setOpenSecretary((current) => (current === secretary.name ? '' : secretary.name))}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Add secretary details to /public/data/secretaries.csv to populate this section." />
        )}
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold">Past Tenures</h2>
        {groupedPastCoordinators.length ? (
          <div className="space-y-10">
            {groupedPastCoordinators.map(([tenure, members]) => (
              <div key={tenure} className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-white">{tenure === '2020-21' ? 'Founders' : tenure}</h3>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {members.map((member) => (
                    <PersonHoverCard
                      key={`${member.name}-${member.tenure}`}
                      name={member.name}
                      post={member.post || (tenure === '2020-21' ? 'Founder' : 'Coordinator')}
                      photo={member.photo}
                      subtitle={tenure === '2020-21' ? '2020-21' : member.tenure}
                      linkedin={member.linkedin}
                      github={member.github}
                      instagram={member.instagram}
                      email={member.email}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="Add previous-tenure coordinators to /public/data/past-coordinators.csv to list them here." />
        )}
      </section>
    </div>
  );
};

export default TeamPage;
