import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Avatar from '../components/Avatar';
import { getSocket } from '../lib/socket';


const verb = (t) => ({
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'followed you',
  follow_request: 'requested to follow you',
  mention: 'mentioned you',
  message: 'sent you a message'
}[t] || 'updated');

export default function Notifications() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  useEffect(() => {

    api
      .get('/notifications')
      .then(r => setItems(r.data.notifications));

    api
      .post('/notifications/read-all')
      .catch(() => {});

    const s = getSocket();

    s?.on('notification:new', (n) => {
      setItems(prev => [n, ...prev]);
    });

    return () => s?.off('notification:new');

  }, []);

  return (
    <div className="card divide-y divide-brand-50 dark:divide-zinc-800">

      <div className="p-5 flex items-center justify-between">

        <h2 className="font-display font-bold text-2xl dark:text-white">
          Notifications
        </h2>

      </div>

      {items.length === 0 && (

        <div className="p-10 text-center">

          <div className="text-3xl mb-2">
            🎉
          </div>

          <p className="font-semibold dark:text-white">
            You're all caught up!
          </p>

          <p className="text-ink/50 dark:text-zinc-400 text-sm">
            Check back later for more updates.
          </p>

        </div>

      )}

      {items.map(n => (

        <button
          key={n._id}
          onClick={() => {

           if (
  n.type === 'follow' ||
  n.type === 'follow_request'
) {

              if (n.sender?.username) {
                navigate(`/profile/${n.sender.username}`);
              }

            }

            else if (n.type === 'like') {

              if (n.sender?.username) {
                navigate(`/profile/${n.sender.username}`);
              }

            }

            else if (
              n.type === 'comment' ||
              n.type === 'mention'
            ) {

              const postId =
                typeof n.post === 'object'
                  ? n.post._id
                  : n.post;

              if (postId) {
                navigate(`/post/${postId}`);
              }

            }

            else if (n.type === 'message') {

              navigate('/messages');

            }

          }}
          className={`w-full text-left p-4 flex gap-3 items-center transition
          hover:bg-brand-50 dark:hover:bg-zinc-800
          ${
            !n.read
              ? 'bg-brand-50/40 dark:bg-zinc-800/60'
              : ''
          }`}
        >

          <Avatar
            src={n.sender?.avatar}
            name={n.sender?.fullName || n.sender?.username}
          />

          <div className="flex-1">

            <p className="text-sm dark:text-white">

              <span className="font-semibold">
                {n.sender?.fullName || n.sender?.username}
              </span>{' '}

              {verb(n.type)}.

            </p>

            <p className="text-xs text-ink/50 dark:text-zinc-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>

            {n.commentText && (

              <p className="text-sm text-ink/60 dark:text-zinc-300 mt-1 italic">
                "{n.commentText}"
              </p>

            )}


            {n.type === 'follow_request' && (
  <div className="flex gap-2 mt-3">

    <button
      onClick={async (e) => {
        e.stopPropagation();

        try {

          await api.post(
            `/users/${n.sender._id}/accept-request`
          );

          setItems(prev =>
            prev.filter(item => item._id !== n._id)
          );

        } catch (err) {
          console.error(err);
        }
      }}
      className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm"
    >
      Accept
    </button>

    <button
      onClick={async (e) => {
        e.stopPropagation();

        try {

          await api.post(
            `/users/${n.sender._id}/reject-request`
          );

          setItems(prev =>
            prev.filter(item => item._id !== n._id)
          );

        } catch (err) {
          console.error(err);
        }
      }}
      className="px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm"
    >
      Reject
    </button>

  </div>
)}

          </div>

          <button
            onClick={async (e) => {

              e.stopPropagation();

              try {

                await api.delete(`/notifications/${n._id}`);

                setItems(prev =>
                  prev.filter(item => item._id !== n._id)
                );

              } catch (err) {

                console.error(err);

              }

            }}
            className="text-ink/40 dark:text-zinc-500 hover:text-red-500 px-2"
          >
            ✕
          </button>

        </button>

      ))}

    </div>
  );

}