import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import { useAuth } from '../store/auth';
import { Link as LinkIcon, MapPin, Calendar } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
const clearAuthUser = useAuth(s => s.setUser);
const me = useAuth(s => s.user);
const [user, setUser] = useState(null);
const [posts, setPosts] = useState([]);
const [savedPosts, setSavedPosts] = useState([]);
const [taggedPosts, setTaggedPosts] = useState([]);
const [activeTab, setActiveTab] = useState('posts');
  const [following, setFollowing] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

const [showFollowing, setShowFollowing] = useState(false);
const [mediaViewer, setMediaViewer] = useState(null);
const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

  useEffect(() => {
    api.get(`/users/${username}`).then(r => {
      setUser(r.data.user);
      if (r.data.isBlocked) {
  setUser({
    ...r.data.user,
    blockedView: true
  });

  return;
}
      setFollowing(r.data.user.followers.some(f => f._id === me?._id));
      setBlocked(
  me?.blockedUsers?.includes(
    r.data.user._id
  )
);
      api.get(`/posts/user/${r.data.user._id}`).then(rp => setPosts(rp.data.posts));
      api
  .get(`/users/${r.data.user._id}/tagged`)
  .then(rt => setTaggedPosts(rt.data.posts))
  .catch(() => {});
      if (r.data.user._id === me?._id) {

  api
    .get(`/users/${r.data.user._id}/saved`)
    .then(rs => setSavedPosts(rs.data.posts))
    .catch(() => {});

}
    });
  }, [username]);

  const follow = async () => {
    const { data } = await api.post(`/users/${user._id}/follow`);
    setFollowing(data.following);
  };
  
const logout = async () => {
  try {
    await api.post('/auth/logout');

    localStorage.removeItem('accessToken');

   clearAuthUser(null);

    navigate('/login');
  } catch (err) {
    console.error(err);
  }
};
  if (!user) return <div className="card p-10 text-center">Loading…</div>;
  const isMe = me?._id === user._id;
  const isAdmin = me?.role === 'admin';


  if (user.blockedView) {
  return (
    <div className="card p-10 text-center">
      You are blocked by this user.
    </div>
  );
}

  return (
    
    <div className="space-y-5">
      <div className="card overflow-hidden">
        <div
  className={`h-44 overflow-hidden cursor-pointer ${
  isCozy
    ? 'bg-cozy-dark'
    : 'bg-brand-gradient'
}`}
  onClick={() => {
    if (user.cover) {
     setMediaViewer(user.cover);
    }
  }}
>

  {
    user.cover && (

      <img
        src={user.cover}
        alt="cover"
        className="w-full h-full object-cover"
      />

    )
  }

</div>
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between">
            <div
  className="w-24 h-24 rounded-full ring-4 ring-white bg-white overflow-hidden cursor-pointer"
  onClick={() => {
    if (user.avatar) {
      setMediaViewer(user.avatar);
    }
  }}
>
              <Avatar src={user.avatar} name={user.fullName || user.username} size={96}/>
            </div>

         <div className="flex gap-3">
  {!isMe ? (
    <>
      <button
        onClick={follow}
        className={following ? 'btn-outline' : 'btn-primary'}
      >
        {following ? 'Following' : 'Follow'}
      </button>

      {following && user.following?.some(f => f._id === me?._id) && (
        <button
          onClick={async () => {
            try {
              const { data } = await api.post(
                `/messages/conversations/${user._id}`
              );

              navigate(`/messages/${data.conversation._id}`);
            } catch (err) {
              console.error(err);
            }
          }}
          className="btn-outline"
        >
          Message
        </button>
      )}


      <button
  onClick={async () => {

    try {

      const { data } = await api.post(
        `/users/${user._id}/block`
      );

      setBlocked(data.blocked);

      

    } catch (err) {
      console.error(err);
    }

  }}
  className="btn-outline text-red-500"
>
  {blocked ? 'Unblock' : 'Block'}
</button>

{isAdmin && !isMe && (

  <button
    onClick={async () => {

      try {

        await api.patch(
          `/users/admin/${
            user.isBanned
              ? 'unban'
              : 'ban'
          }/${user._id}`
        );

        setUser({
          ...user,
          isBanned: !user.isBanned
        });

      } catch (err) {
        console.error(err);
      }

    }}
    className="btn-outline text-red-600"
  >
    {user.isBanned
      ? 'Unban User'
      : 'Ban User'}
  </button>

)}
    </>
  ) : (
    <>
    

      <button
        onClick={() => navigate('/edit-profile')}
        className="btn-primary"
      >
        Edit Profile
      </button>

      <button
        onClick={logout}
        className="btn-outline"
      >
        Logout
      </button>
    </>
  )}
</div>
          </div>
          <h1 className="font-display font-extrabold text-2xl mt-3">{user.fullName || user.username}</h1>
          <p className="text-ink/50 dark:text-zinc-400">@{user.username}</p>
          {user.bio && <p className="mt-3 text-ink/80 dark:text-zinc-200">{user.bio}</p>}
         <div className="flex flex-wrap gap-4 text-sm text-ink/60 dark:text-zinc-400 mt-3">
            <span className="flex items-center gap-1"><Calendar size={14}/> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            {user.socialLinks?.website && <a href={user.socialLinks.website} className="flex items-center gap-1 text-brand-600"><LinkIcon size={14}/> Website</a>}
          </div>
        <div className="flex gap-6 mt-4">

  <button
    onClick={() => setShowFollowing(true)}
  >
    <span className="font-bold">
      {user.following?.length || 0}
    </span>{' '}
    <span className="text-ink/60 dark:text-zinc-400 text-sm">
      Following
    </span>
  </button>

  <button
    onClick={() => setShowFollowers(true)}
  >
    <span className="font-bold">
      {user.followers?.length || 0}
    </span>{' '}
   <span className="text-ink/60 dark:text-zinc-400 text-sm">
      Followers
    </span>
  </button>

  <div>
    <span className="font-bold">
      {posts.length}
    </span>{' '}
  <span className="text-ink/60 dark:text-zinc-400 text-sm">
      Posts
    </span>
  </div>

</div>
        </div>
      </div>
<div className="card p-2 flex items-center justify-center gap-2">

  <button
    onClick={() => setActiveTab('posts')}
    className={`px-5 py-2 rounded-xl font-medium transition ${
     activeTab === 'posts'
  ? isCozy
   ? 'bg-[#8ba7d8] text-white'
    : 'bg-brand-600 text-white'
  : 'dark:text-zinc-300'
    }`}
  >
    Posts
  </button>

  {isMe && (

    <button
      onClick={() => setActiveTab('saved')}
      className={`px-5 py-2 rounded-xl font-medium transition ${
      activeTab === 'saved'
  ? isCozy
    ? 'bg-[#8ba7d8] text-white'
    : 'bg-brand-600 text-white'
  : 'dark:text-zinc-300'
      }`}
    >
      Saved
    </button>

  )}

  <button
    onClick={() => setActiveTab('tagged')}
    className={`px-5 py-2 rounded-xl font-medium transition ${
     activeTab === 'tagged'
  ? isCozy
    ? 'bg-[#8ba7d8] text-white'
    : 'bg-brand-600 text-white'
  : 'dark:text-zinc-300'
    }`}
  >
    Tagged
  </button>

</div>

      <div className="space-y-5">

  {activeTab === 'posts' && (

    <>
      {posts.length === 0 && (

        <div className="card p-10 text-center text-ink/50 dark:text-zinc-400">

          No posts yet.

        </div>

      )}

      {posts.map(p => (

        <PostCard
          key={p._id}
          post={p}
          currentUserId={me?._id}
        />

      ))}

    </>

  )}

  {activeTab === 'saved' && isMe && (

    <>
      {savedPosts.length === 0 && (

        <div className="card p-10 text-center text-ink/50 dark:text-zinc-400">

          No saved posts yet.

        </div>

      )}

      {savedPosts.map(p => (

        <PostCard
          key={p._id}
          post={p}
          currentUserId={me?._id}
        />

      ))}

    </>

  )}
{activeTab === 'tagged' && (

  <>

    {taggedPosts.length === 0 && (

      <div className="card p-10 text-center text-ink/50 dark:text-zinc-400">

        No tagged posts yet.

      </div>

    )}

    {taggedPosts.map(p => (

      <PostCard
        key={p._id}
        post={p}
        currentUserId={me?._id}
      />

    ))}

  </>

)}

</div>
          {showFollowers && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

          <div className="bg-white dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-4">

              <h2 className="font-bold text-xl">
                Followers
              </h2>

              <button
                onClick={() => setShowFollowers(false)}
               className="text-ink/50 dark:text-zinc-400"
              >
                ✕
              </button>

            </div>

            <div className="space-y-3">

              {user.followers?.map(f => (

                <button
                  key={f._id}
                  onClick={() => {
                    navigate(`/profile/${f.username}`);
                    setShowFollowers(false);
                  }}
                  className="w-full flex items-center gap-3 hover:bg-brand-50 dark:hover:bg-zinc-800 p-2 rounded-xl"
                >

                  <Avatar
                    src={f.avatar}
                    name={f.fullName || f.username}
                  />

                  <div className="text-left">

                    <div className="font-semibold">
                      {f.fullName || f.username}
                    </div>

                    <div className="text-xs text-ink/50 dark:text-zinc-400">
                      @{f.username}
                    </div>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>
      )}

      {showFollowing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

          <div className="bg-white dark:bg-zinc-900 dark:text-white w-full max-w-md rounded-2xl p-5 max-h-[80vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-4">

              <h2 className="font-bold text-xl">
                Following
              </h2>

              <button
                onClick={() => setShowFollowing(false)}
                className="text-ink/50 dark:text-zinc-400"
              >
                ✕
              </button>

            </div>

            <div className="space-y-3">

              {user.following?.map(f => (

                <button
                  key={f._id}
                  onClick={() => {
                    navigate(`/profile/${f.username}`);
                    setShowFollowing(false);
                  }}
                  className="w-full flex items-center gap-3 hover:bg-brand-50 dark:hover:bg-zinc-800 p-2 rounded-xl"
                >

                  <Avatar
                    src={f.avatar}
                    name={f.fullName || f.username}
                  />

                  <div className="text-left">

                    <div className="font-semibold">
                      {f.fullName || f.username}
                    </div>

                    <div className="text-xs text-ink/50 dark:text-zinc-400">
                      @{f.username}
                    </div>

                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>
      )}

      {mediaViewer && (

  <div
    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
    onClick={() => setMediaViewer(null)}
  >

    <button
      className="absolute top-5 right-5 text-white text-3xl"
      onClick={() => setMediaViewer(null)}
    >
      ✕
    </button>

    <img
      src={mediaViewer}
      alt="media"
      className="max-w-full max-h-full rounded-2xl object-contain"
      onClick={(e) => e.stopPropagation()}
    />

  </div>

)}

    </div>
  );
}

