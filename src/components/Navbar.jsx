import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const BASE_URL = import.meta.env.BASE_URL;

const navItems = [
  ['/', 'Home'],
  ['/games', 'Games'],
  ['/events', 'Events'],
  ['/learning', 'Learning'],
  ['/blog', 'Blog'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact Us'],
];

const navLinkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-xl border px-3 py-2 text-sm font-medium uppercase tracking-[0.16em] transition xl:px-3.5 ${
    isActive
      ? 'border-accent2/60 bg-accent2/15 text-accent2 shadow-[0_0_24px_rgba(181,159,119,0.12)]'
      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white'
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto w-full max-w-7xl px-2 py-3 sm:px-6 lg:px-8">
        <div className="rounded-[1.6rem] border border-white/10 bg-black/30 px-2 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-4">
          <div className="flex items-center justify-between gap-3 xl:gap-6">
            <NavLink to="/" className="min-w-0 flex items-center gap-2 leading-tight sm:gap-3" onClick={() => setOpen(false)}>
              <div className="relative shrink-0">
                <img
                  src={`${BASE_URL}images/logo.jpeg`}
                  alt="Game Development Club Logo"
                  className="h-10 w-10 rounded-full border border-white/15 object-cover shadow-[0_0_16px_rgba(181,159,119,0.12)] sm:h-11 sm:w-11"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-[0.03em] text-accent sm:text-lg sm:tracking-[0.05em]">Game Development Club</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 sm:text-[11px] sm:tracking-[0.24em]">IIT Kanpur</p>
              </div>
            </NavLink>

            <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 lg:flex xl:gap-3">
              <div className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {navItems.map(([path, label]) => (
                  <NavLink key={path} to={path} className={navLinkClass}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm uppercase tracking-[0.16em] text-slate-200"
                onClick={() => setOpen((value) => !value)}
              >
                Menu
              </button>
            </div>
          </div>

          {open ? (
            <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 lg:hidden">
              {navItems.map(([path, label]) => (
                <NavLink key={path} to={path} onClick={() => setOpen(false)} className={navLinkClass}>
                  {label}
                </NavLink>
              ))}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

