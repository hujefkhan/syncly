import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';
import Avatar from './Avatar';
import { useAuth } from "../store/auth";
import { Link } from 'react-router-dom';

const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

export default function PostCard({ post, currentUserId }) {
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';
  const [liked, setLiked] = useState(post.likes?.includes(currentUserId));
  const [count, setCount] = useState(post.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [users, setUsers] = useState([]);
  const toggleLike = async () => {
  const { data } = await api.post(`/posts/${post._id}/like`);
    setLiked(data.liked); setCount(data.likeCount);
  };
  const toggleSave = async () => {
    await api.post(`/users/save/${post._id}`); setSaved(s => !s);
  };

 const loadComments = async () => {
  try {
    const { data } = await api.get(`/comments/post/${post._id}`);
    setComments(data.comments || []);
  } catch (err) {
    console.error(err);
  }
};

const loadReplies = async (commentId) => {
  try {
    const { data } = await api.get(`/comments/${commentId}/replies`);

    setReplies(prev => ({
      ...prev,
      [commentId]: data.replies || []
    }));
  } catch (err) {
    console.error(err);
  }
};
const sharePost = async () => {

  try {

    const { data } = await api.get(
      '/messages/conversations'
    );

    setUsers(
      data.conversations || []
    );

    setShowShareModal(true);

  } catch (err) {

    console.error(err);

  }

};

  return (
    <article className="card p-5 space-y-4">
      <header className="flex items-center justify-between">
        <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3">
          <Avatar src={post.author?.avatar} name={post.author?.fullName || post.author?.username} />
          <div>
            <div className="font-semibold text-ink dark:text-white">{post.author?.fullName || post.author?.username}</div>
            <div className="text-xs text-ink/50 dark:text-zinc-400">@{post.author?.username} · {timeAgo(post.createdAt)}</div>
          </div>
        </Link>
    <div className="relative">

  <button
    onClick={() => setShowMenu(!showMenu)}
   className="text-ink/40 dark:text-zinc-500 hover:text-ink dark:hover:text-white"
  >
    <MoreHorizontal size={20} />
  </button>

  {showMenu && post.author?._id === currentUserId && (
    <div className="absolute right-0 mt-2 bg-white dark:bg-zinc-900 border border-brand-100 dark:border-zinc-800 rounded-xl shadow-lg p-2 z-20">

      <button
  onClick={() => {
    setIsEditing(true);
    setShowMenu(false);
  }}
  className="hover:bg-brand-50 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg text-sm w-full text-left"
>
  Edit
</button>

      <button
        onClick={async () => {

          const confirmDelete = window.confirm(
            'Delete this post?'
          );

          if (!confirmDelete) return;

          try {

            await api.delete(`/posts/${post._id}`);

            window.location.reload();

          } catch (err) {
            console.error(err);
          }

        }}
       className="text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg text-sm w-full text-left"
      >
        Delete 
      </button>

    </div>
  )}

</div>
      </header>



     {isEditing ? (

  <div className="space-y-2">

    <textarea
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      className="input min-h-[100px] w-full"
    />

    <div className="flex gap-2">

      <button
        onClick={async () => {

          try {

            await api.patch(`/posts/${post._id}`, {
              content: editText
            });

            post.content = editText;

            setIsEditing(false);

          } catch (err) {
            console.error(err);
          }

        }}
        className="btn-primary"
      >
        Save
      </button>

      <button
        onClick={() => {
          setIsEditing(false);
          setEditText(post.content);
        }}
        className="px-4 py-2 rounded-xl border"
      >
        Cancel
      </button>

    </div>

  </div>

) : (

  post.content && (
  <p className="text-ink/90 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap">

  {post.content.split(/(\s+)/).map((word, i) => {

    if (word.startsWith('@')) {

      return (
        <Link
          key={i}
          to={`/profile/${word.slice(1)}`}
         className={`hover:underline ${
  isCozy
    ? 'text-[#8EB6D9]'
    : 'text-brand-600'
}`}
        >
          {word}
        </Link>
      );

    }

    return word;

  })}

</p>
  )

)}

{!!post.images?.length && (

  <div
    className={`grid gap-2 rounded-xl overflow-hidden ${
      post.images.length > 1
        ? 'grid-cols-2'
        : 'grid-cols-1'
    }`}
  >

 {post.images.map((img, i) => (

  img.url.match(/\.(mp3|wav|ogg)$/i) ? (

    <div
      key={i}
      className="w-full min-h-[220px] rounded-xl bg-zinc-900 flex items-center justify-center p-6"
    >

      <audio
        src={img.url}
        controls
        className="w-full"
      />

    </div>

  ) : img.url.match(/\.(mp4|webm|mov)$/i) ? (

    <video
      key={i}
      src={img.url}
      controls
      playsInline
      onClick={() =>
        setFullscreenImage(img.url)
      }
      className="w-full max-h-[80vh] object-contain rounded-xl bg-black cursor-pointer"
    />

  ) : (

    <img
      key={i}
      src={img.url}
      alt=""
      onClick={() =>
        setFullscreenImage(img.url)
      }
      className="w-full max-h-[80vh] object-contain cursor-pointer hover:opacity-95 transition bg-black rounded-xl"
    />

  )

))}
  </div>

)}
   <footer className="flex items-center justify-between text-ink/60 dark:text-zinc-400 pt-2 border-t border-brand-50 dark:border-zinc-800">
        <button onClick={toggleLike} className={`flex items-center gap-2 hover:text-rose-500 transition ${liked?'text-rose-500':''}`}>
          <Heart size={20} fill={liked?'currentColor':'none'} /><span className="text-sm">{count}</span>
        </button>
       
       <button
  onClick={async () => {
    setShowComments(!showComments);

    if (!showComments) {
      await loadComments();
    }
  }}
 className={`flex items-center gap-2 ${
  isCozy
    ? 'hover:text-[#8EB6D9]'
    : 'hover:text-brand-600'
}`}
>
  <MessageCircle size={20} />
  <span className="text-sm">{comments.length}</span>
</button>

        <button
  onClick={sharePost}
 className={`flex items-center gap-2 ${
  isCozy
    ? 'hover:text-[#8EB6D9]'
    : 'hover:text-brand-600'
}`}
>

  <Share2 size={20} />

</button>
        <button onClick={toggleSave} className={`${
  isCozy
    ? 'hover:text-[#8EB6D9]'
    : 'hover:text-brand-600'
} ${
  saved
    ? (
        isCozy
          ? 'text-[#8EB6D9]'
          : 'text-brand-600'
      )
    : ''
}`}>
          <Bookmark size={20} fill={saved?'currentColor':'none'} />
        </button>
      </footer>

      {showComments && (
 <div className="border-t border-brand-50 dark:border-zinc-800 pt-4 space-y-4">
    
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (!commentText.trim()) return;

        try {
          await api.post(`/comments/post/${post._id}`, {
           text: commentText
          });

          setCommentText('');
          loadComments();
        } catch (err) {
          console.error(err);
        }
      }}
      className="flex gap-2"
    >
      <input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="input flex-1"
      />

      <button className="btn-primary">
        Post
      </button>
    </form>

    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c._id}
          className="flex gap-3"
        >
          <Avatar
            src={c.author?.avatar}
            name={c.author?.fullName || c.author?.username}
            size={36}
          />

    <div className="bg-brand-50 dark:bg-zinc-800 rounded-xl px-3 py-2 flex-1">
         
  <div className="flex items-center justify-between">
    
    <div className="font-semibold text-sm">
      {c.author?.fullName || c.author?.username}
    </div>

    {c.author?._id === currentUserId && (
      <button
        onClick={async () => {
          try {
            await api.delete(`/comments/${c._id}`);
            loadComments();
          } catch (err) {
            console.error(err);
          }
        }}
        className="text-xs text-red-500 hover:underline"
      >
        Delete
      </button>
    )}
  </div>

  <div className="text-sm text-ink/80 dark:text-zinc-200">
    {c.text}
  </div>

  <div className="flex gap-4 mt-2 text-xs">
  <button
    onClick={async () => {
      if (replyingTo === c._id) {
        setReplyingTo(null);
      } else {
        setReplyingTo(c._id);
        await loadReplies(c._id);
      }
    }}
   className={`hover:underline ${
  isCozy
    ? 'text-[#8EB6D9]'
    : 'text-brand-600'
}`}
  >
    Reply
  </button>
</div>

{replyingTo === c._id && (
  <div className="mt-3 space-y-3">

    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (!replyText.trim()) return;

        try {
          await api.post(`/comments/post/${post._id}`, {
            text: replyText,
            parent: c._id
          });

          setReplyText('');
          await loadReplies(c._id);

        } catch (err) {
          console.error(err);
        }
      }}
      className="flex gap-2"
    >
      <input
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
        className="input flex-1"
      />

      <button className="btn-primary">
        Reply
      </button>
    </form>

    <div className="space-y-2 ml-6">
      {(replies[c._id] || []).map((r) => (
        <div
          key={r._id}
          className="flex gap-2"
        >
          <Avatar
            src={r.author?.avatar}
            name={r.author?.fullName || r.author?.username}
            size={30}
          />
<div className="bg-white dark:bg-zinc-900 border border-brand-50 dark:border-zinc-800 rounded-xl px-3 py-2 flex-1">
            <div className="font-semibold text-xs">
              {r.author?.fullName || r.author?.username}
            </div>

           <div className="text-sm text-ink/80 dark:text-zinc-200">
              {r.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
</div>
        </div>
      ))}
    </div>
  </div>
)}

{showShareModal && (

  <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center">

    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-5 max-h-[70vh] overflow-y-auto">

      <div className="flex items-center justify-between mb-4">

        <h2 className="font-bold text-xl dark:text-white">

          Share post

        </h2>

        <button
          onClick={() =>
            setShowShareModal(false)
          }
          className="dark:text-white"
        >

          <X size={24} />

        </button>

      </div>

      <div className="space-y-2">

        {users.map(c => {

          const other =
            c.participants?.find(
              p => p._id !== currentUserId
            );

          if (!other) return null;

          return (

            <button
              key={c._id}
              onClick={async () => {

                try {

                  await api.post(
                    `/messages/${c._id}`,
                    {
                      text: '',
                      sharedPost: post._id
                    }
                  );

                  setShowShareModal(false);

                  alert('Post shared!');

                } catch (err) {

                  console.error(err);

                }

              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-zinc-800"
            >

              <Avatar
                src={other.avatar}
                name={
                  other.fullName ||
                  other.username
                }
              />

              <div className="text-left">

                <div className="font-semibold dark:text-white">

                  {other.fullName ||
                    other.username}

                </div>

                <div className="text-xs text-ink/50 dark:text-zinc-400">

                  @{other.username}

                </div>

              </div>

            </button>

          );

        })}

      </div>

    </div>

  </div>

)}
{fullscreenImage && (

  <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">

    <button
      onClick={() =>
        setFullscreenImage(null)
      }
      className="absolute top-5 right-5 text-white"
    >

      <X size={34} />

    </button>

    {fullscreenImage.includes('/video/upload/') ? (

     <video
  key={fullscreenImage + '-unmuted'}
  src={fullscreenImage}
  controls
  autoPlay
  playsInline
  preload="auto"
  onLoadedMetadata={(e) => {
    e.currentTarget.muted = false;
    e.currentTarget.volume = 1;
  }}
  className="max-w-[95vw] max-h-[95vh] object-contain"
/>

    ) : (

      <img
        src={fullscreenImage}
        alt=""
        className="max-w-[95vw] max-h-[95vh] object-contain"
      />

    )}

  </div>

)}
    </article>
  );
}
