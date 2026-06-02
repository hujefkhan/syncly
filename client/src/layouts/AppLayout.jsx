import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Compass, Bell, MessageSquare, Search, Settings, LogOut, User,  Menu } from 'lucide-react';
import Logo from '../components/Logo';
import Avatar from '../components/Avatar';
import { useAuth } from '../store/auth';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [unread, setUnread] = useState(0);
  const [messageUnread, setMessageUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';
  useEffect(() => {
    api.get('/notifications/unread-count').then(r => setUnread(r.data.count)).catch(()=>{});
    api.get('/messages/unread/count')
  .then(r => setMessageUnread(r.data.count))
  .catch(()=>{});
  }, []);

  const handleLogout = async () => { await logout(); nav('/'); };
  const handleSearch = async (e) => {
  const q = e.target.value;

  setSearchQuery(q);

  if (!q.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    const { data } = await api.get('/search/users', {
      params: { q }
    });

    setSearchResults(data.users || []);
  } catch (err) {
    console.error(err);
  }
};

  const sidebarLinks = [
  { to: '/settings', icon: Settings, label: 'Settings' },
];

  return (

 <div
  className={`min-h-screen ${
    localStorage.getItem('theme') === 'dark'
      ? (
          localStorage.getItem('colorTheme') === 'cozy'
            ? 'dark bg-cozy-dark text-white'
            : 'dark bg-dark-lavender text-white'
        )
      : (
          localStorage.getItem('colorTheme') === 'cozy'
            ? 'bg-cozy'
            : 'bg-lavender'
        )
  }`}
>
     <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-zinc-900/80 border-b border-brand-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-zinc-800"
  >
    <Menu size={22} />
  </button>

  <Link to="/home">
    <Logo />
  </Link>

</div>

{menuOpen && (
  <div
  className={`absolute top-16 left-4 z-50 w-52 rounded-2xl shadow-xl border overflow-hidden ${
    localStorage.getItem('colorTheme') === 'cozy'
      ? 'bg-[#F5FAFF] border-[#D6E4F0]'
      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
  }`}
>

    <Link
  to="/settings"
  onClick={() => setMenuOpen(false)}
  className={`w-full flex items-center gap-3 px-4 py-3 transition ${
  localStorage.getItem('colorTheme') === 'cozy'
    ? 'text-[#6B8FB3] hover:bg-[#E8F2FB]'
    : 'text-brand-500 hover:bg-brand-50'
}`}
>
  <Settings
  size={18}
  className={
    localStorage.getItem('colorTheme') === 'cozy'
      ? 'text-[#6B8FB3]'
      : 'text-brand-500'
  }
/>
  <span>Settings</span>
</Link>

   <button
  onClick={handleLogout}
  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition"
>
     <LogOut
  size={18}
  className="text-red-500"
/>
      <span>Logout</span>
    </button>

  </div>
)}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
         <input
  placeholder="Search Syncly"
  className="input pl-10 py-2.5"
  value={searchQuery}
  onChange={handleSearch}
/>
{searchResults.length > 0 && (
  <div className="absolute top-12 left-0 w-full bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 z-50 overflow-hidden">

    {searchResults.map(user => (
      <button
        key={user._id}
        onClick={() => {
          nav(`/profile/${user.username}`);
          setSearchResults([]);
          setSearchQuery('');
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Avatar
          src={user.avatar}
          name={user.fullName || user.username}
          size={32}
        />

        <div>
          <p className="font-medium">
            {user.username}
          </p>

          <p className="text-xs text-gray-500">
            {user.fullName}
          </p>
        </div>
      </button>
    ))}

  </div>
)}
          </div>
        <div className="flex items-center gap-3">

  <Link
    to="/notifications"
    className="relative p-2 hover:bg-brand-50 dark:hover:bg-zinc-800 rounded-xl"
  >
    <Bell size={20} />

    {unread > 0 && (
     <span
  className={`absolute -top-0.5 -right-0.5 ${
    isCozy
      ? 'bg-[#8EB6D9]'
      : 'bg-rose-500'
  } text-white text-[10px] rounded-full px-1.5`}
>
        {unread}
      </span>
    )}
  </Link>

  <Link
    to="/messages"
    className="relative p-2 hover:bg-brand-50 dark:hover:bg-zinc-800 rounded-xl"
  >
    <MessageSquare size={20} />

    {messageUnread > 0 && (
     <span
  className={`absolute -top-0.5 -right-0.5 ${
    isCozy
      ? 'bg-[#8EB6D9]'
      : 'bg-rose-500'
  } text-white text-[10px] rounded-full px-1.5`}
>
        {messageUnread}
      </span>
    )}
  </Link>

  <Link to={`/profile/${user?.username}`}>
    <Avatar
      src={user?.avatar}
      name={user?.fullName || user?.username}
      size={36}
    />
  </Link>

</div>
        </div>
      </header>

     <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-6 py-6 pb-24">
      
      <main className="col-span-12">
          <Outlet />
        </main>
      </div>

  <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-zinc-900 border-t border-brand-100 dark:border-zinc-800 z-30">
       <div className="grid grid-cols-3">

  {[
    {
      to: '/home',
      icon: Home,
      label: 'Home'
    },
    {
      to: '/explore',
      icon: Compass,
      label: 'Explore'
    },
    {
      to: `/profile/${user?.username}`,
      icon: User,
      label: 'Profile'
    }
  ].map(l => (

    <NavLink
      key={l.to}
      to={l.to}
      className={({isActive}) =>
        `flex flex-col items-center py-2.5 text-xs ${
          isActive
  ? (
      isCozy
        ? 'text-[#8EB6D9]'
        : 'text-brand-700'
    )
  : 'text-ink/60 dark:text-zinc-400'
        }`
      }
    >
      <l.icon size={20} />

      <span className="mt-0.5">
        {l.label}
      </span>

    </NavLink>

  ))}

</div>
      </nav>
    </div>
  );
}
