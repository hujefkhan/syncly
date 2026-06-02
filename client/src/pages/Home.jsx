import { useEffect, useState } from 'react';
import api from '../lib/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { useAuth } from '../store/auth';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { Hash } from 'lucide-react';
import StoryBar from '../components/StoryBar';

export default function Home() {

 const user = useAuth(s => s.user);

const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [feedType, setFeedType] = useState('foryou');

useEffect(() => {

  api
    .get(`/posts/feed/${feedType}`)
    .then(r => setPosts(r.data.posts))
    .catch(() => {});

  api
    .get('/search/trending')
    .then(r => setTrending(r.data.trending))
    .catch(() => {});

  api
    .get('/users/suggested')
    .then(r => setSuggested(r.data.users))
    .catch(() => {});

}, [feedType]);

  const onCreated = (p) => {
    setPosts(prev => [p, ...prev]);
  };

  const follow = async (id) => {

    await api.post(`/users/${id}/follow`);

    setSuggested(s =>
      s.filter(u => u._id !== id)
    );

  };

  return (

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <div className="xl:col-span-2 space-y-5">

        <StoryBar />
        <CreatePost onCreated={onCreated} />
        <div className="card p-2 flex gap-2">

  <button
    onClick={() => setFeedType('foryou')}
    className={`flex-1 py-2 rounded-xl font-semibold transition ${
      feedType === 'foryou'
  ? (
      isCozy
        ? 'bg-[#8EB6D9] text-white'
        : 'bg-brand-gradient text-white'
    )
        : 'text-ink dark:text-zinc-300 hover:bg-brand-50 dark:hover:bg-zinc-800'
    }`}
  >
    For You
  </button>

  <button
    onClick={() => setFeedType('following')}
    className={`flex-1 py-2 rounded-xl font-semibold transition ${
     feedType === 'following'
  ? (
      isCozy
        ? 'bg-[#8EB6D9] text-white'
        : 'bg-brand-gradient text-white'
    )
        : 'text-ink dark:text-zinc-300 hover:bg-brand-50 dark:hover:bg-zinc-800'
    }`}
  >
    Following
  </button>

</div>

        {posts.length === 0 && (

          <div className="card p-10 text-center text-ink/50 dark:text-zinc-400">

            <div className="text-4xl mb-2">
              🌸
            </div>

            <p>
              Your feed is empty. Follow creators on Explore to see their posts here.
            </p>

          </div>

        )}

        {posts.map(p => (

          <PostCard
            key={p._id}
            post={p}
            currentUserId={user?._id}
          />

        ))}

      </div>

      <aside className="hidden xl:block space-y-5">

        <div className="card p-5">

          <h3 className="font-display font-bold mb-3 dark:text-white">
            Trending
          </h3>

          <ul className="space-y-2.5">

            {trending.length === 0 && (

              <li className="text-sm text-ink/50 dark:text-zinc-400">
                No trends yet.
              </li>

            )}

            {trending.map(t => (

              <li
                key={t.tag}
                className="flex items-center justify-between"
              >

                <span className="flex items-center gap-2 text-ink/80 dark:text-zinc-200">

                  <Hash
                    size={14}
                  className={
  isCozy
    ? 'text-[#8EB6D9]'
    : 'text-brand-600'
}
                  />

                  {t.tag}

                </span>

                <span className="text-xs text-ink/50 dark:text-zinc-400">
                  {t.count} syncs
                </span>

              </li>

            ))}

          </ul>

        </div>

        <div className="card p-5">

          <h3 className="font-display font-bold mb-3 dark:text-white">
            Suggested for you
          </h3>

          <ul className="space-y-3">

            {suggested.map(u => (

              <li
                key={u._id}
                className="flex items-center gap-3"
              >

                <Avatar
                  src={u.avatar}
                  name={u.fullName || u.username}
                  size={36}
                />

                <div className="flex-1 min-w-0">

                  <Link
                    to={`/profile/${u.username}`}
                    className="font-semibold text-sm truncate block dark:text-white"
                  >
                    {u.fullName || u.username}
                  </Link>

                  <div className="text-xs text-ink/50 dark:text-zinc-400 truncate">
                    @{u.username}
                  </div>

                </div>

                <button
                  onClick={() => follow(u._id)}
                className={`text-xs font-semibold ${
  isCozy
    ? 'text-[#8EB6D9]'
    : 'text-brand-700 hover:text-brand-800'
}`}
                >
                  Follow
                </button>

              </li>

            ))}

          </ul>

        </div>

      </aside>

    </div>

  );

}