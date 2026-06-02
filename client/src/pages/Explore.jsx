import PostCard from '../components/PostCard';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import {
  Search,
  Flame,
  Users,
  Play,
  Music2,
  Image as ImageIcon,
  SlidersHorizontal
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import ExploreCard from '../components/ExploreCard';
import { useAuth } from '../store/auth';

export default function Explore() {

  const user = useAuth(s => s.user);
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selectedPost, setSelectedPost] =
  useState(null);

  const [activeTab, setActiveTab] =
    useState('Trending');
    const [sortBy, setSortBy] =
  useState('latest');

const [showFilters, setShowFilters] =
  useState(false);

const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

 useEffect(() => {

  if (activeTab === 'People') {

    api
      .get('/users/explore/people')
      .then(r => {

        setUsers(r.data.users);

        setPosts([]);

      });

  } else {

    api
      .get('/posts/explore', {
        params: {
  category: activeTab,
  sortBy
}
      })
      .then(r => {

        setPosts(r.data.posts);

        setUsers([]);

      });

  }

  api
    .get('/search/trending')
    .then(r => setTrending(r.data.trending));

}, [activeTab, sortBy, user]);

  useEffect(() => {

  if (selectedPost) {

    document.body.style.overflow = 'hidden';

  } else {

    document.body.style.overflow = 'auto';

  }

  const handleEsc = (e) => {

    if (e.key === 'Escape') {

      setSelectedPost(null);

    }

  };

  window.addEventListener('keydown', handleEsc);

  return () => {

    document.body.style.overflow = 'auto';

    window.removeEventListener(
      'keydown',
      handleEsc
    );

  };

}, [selectedPost]);

  const search = async (e) => {

    e.preventDefault();

    if (!q.trim()) return;

    const { data } = await api.get(
      '/search',
      {
        params: { q }
      }
    );

    setUsers(data.users);
    setPosts(data.posts);

  };

  const tabs = [
    {
      label: 'Trending',
      icon: Flame
    },
    {
      label: 'People',
      icon: Users
    },
    {
      label: 'Reels',
      icon: Play
    },
    {
      label: 'Audio',
      icon: Music2
    },
    {
      label: 'Art',
      icon: ImageIcon
    },
  ];

  return (

    <div className="space-y-6">

      {/* SEARCH */}

      <form
        onSubmit={search}
        className="card p-5 flex items-center gap-4"
      >

<Search
  size={20}
  className="text-zinc-500 dark:text-zinc-400"
/>


<input
  value={q}
  onChange={e => setQ(e.target.value)}
  placeholder="Explore trending vibes, creators, and reels..."
  className="flex-1 bg-transparent outline-none text-lg text-black dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
/>

      </form>

      {/* CATEGORY TABS */}

      <div className="flex items-center justify-between flex-wrap gap-3">

        <div className="flex flex-wrap gap-3">

          {tabs.map(tab => {

            const Icon = tab.icon;

            return (

              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-5 py-3 rounded-full border transition flex items-center gap-2 text-sm font-medium ${
                 activeTab === tab.label
  ? (
      isCozy
        ? 'bg-[#8EB6D9] text-white border-transparent shadow-lg'
        : 'bg-brand-gradient text-white border-transparent shadow-lg'
    )
  : 'bg-white dark:bg-zinc-900 hover:bg-brand-50 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                }`}
              >

                <Icon size={16}/>

                {tab.label}

              </button>

            );

          })}

        </div>

     <div className="relative">

<button
  onClick={() =>
    setShowFilters(v => !v)
  }
 className="w-11 h-11 rounded-full border bg-white dark:bg-zinc-900 dark:border-zinc-700 grid place-items-center hover:bg-brand-50 dark:hover:bg-zinc-800"
>

  <SlidersHorizontal size={18}/>

</button>

{showFilters && (

  <div className="absolute right-0 top-14 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-2xl shadow-xl p-2 w-44 z-50">

    <button
      onClick={() => {
        setSortBy('latest');
        setShowFilters(false);
      }}
      className="w-full text-left px-4 py-2 rounded-xl hover:bg-brand-50"
    >
      Latest
    </button>

    <button
      onClick={() => {
        setSortBy('likes');
        setShowFilters(false);
      }}
      className="w-full text-left px-4 py-2 rounded-xl hover:bg-brand-50"
    >
      Most Liked
    </button>

   <button
  onClick={() => {
    setSortBy('trending');
    setShowFilters(false);
  }}
  className="w-full text-left px-4 py-2 rounded-xl hover:bg-brand-50"
>
  Trending
</button>

  </div>

)}

</div>

      </div>

      {/* TRENDING TAGS */}

      {!!trending.length && (

        <div className="flex flex-wrap gap-3">

          {trending.map(t => (

            <button
              key={t.tag}
              className={`px-4 py-2 rounded-full ${
  isCozy
    ? 'bg-blue-100 text-[#5d7fa5]'
    : 'bg-brand-50 text-brand-700'
} text-sm hover:scale-105 transition`}
            >

              #{t.tag}
              <span className="opacity-60">
                {' '}· {t.count}
              </span>

            </button>

          ))}

        </div>

      )}

      {/* PEOPLE */}

{activeTab === 'People' &&
 !!users.length && (
  
        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="font-display text-3xl font-bold">

              Creators

            </h2>

          <button
  className={`font-medium ${
    isCozy
      ? 'text-[#8EB6D9]'
      : 'text-brand-600'
  }`}
>

              View all →

            </button>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

            {users.map(u => (

              <Link
                to={`/profile/${u.username}`}
                key={u._id}
                className="card p-5 hover:-translate-y-1 transition"
              >

                <div className="flex items-center gap-4">

                  <Avatar
                    src={u.avatar}
                    name={u.fullName || u.username}
                    size={58}
                  />

                  <div className="min-w-0">

                    <div className="font-semibold truncate text-lg">

                      {u.fullName || u.username}

                    </div>

                   <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                      @{u.username}

                    </div>

                  </div>

                </div>

                {!!u.bio && (

<p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                    {u.bio}

                  </p>

                )}

              </Link>

            ))}

          </div>

        </div>

      )}

      {/* POSTS */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="font-display text-5xl font-black tracking-tight">

              Fresh Finds

            </h2>

           <p className="text-zinc-500 dark:text-zinc-400 mt-1">

              Discover what's synchronized with your world today.

            </p>

          </div>

        </div>

       <div className="columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-6 space-y-6">

          {posts.map(p => (

            <div
              key={p._id}
              className="break-inside-avoid"
            >
<div
  onClick={() => setSelectedPost(p)}
  className="cursor-pointer"
>

 <ExploreCard post={p} />

</div>

            </div>

          ))}

        </div>

      </div>
{selectedPost && (

  <div
    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    onClick={() => setSelectedPost(null)}
  >

   <div
  className="relative bg-white dark:bg-zinc-900 w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300"
  onClick={(e) => e.stopPropagation()}
>

      <button
        onClick={() => setSelectedPost(null)}
        className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/70 text-white backdrop-blur-md hover:scale-110 transition"
      >

        ✕

      </button>

      <div
  className={`h-[90vh] overflow-y-auto p-6 ${
    isCozy
      ? 'bg-[#eef5fc] dark:bg-[#0f1722]'
      : 'bg-[#f4ecfb] dark:bg-zinc-950'
  }`}
>
         <PostCard
  post={selectedPost}
  exploreMode={true}
  currentUserId={user?._id}
/>

      </div>

    </div>

  </div>

)}
    </div>

  );

}