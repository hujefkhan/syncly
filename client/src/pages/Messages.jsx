import { useEffect, useRef, useState } from 'react';
import { useParams,   Link } from 'react-router-dom';
import api from '../lib/api';
import Avatar from '../components/Avatar';
import { getSocket } from '../lib/socket';
import { useAuth } from '../store/auth';
import { Send } from 'lucide-react';
import {
  Pencil,
  ImageIcon,
  UserPlus,
  LogOut,
  Trash2,
  ChevronRight
} from 'lucide-react';
export default function Messages() {
  const me = useAuth(s => s.user);
  const { conversationId } = useParams();
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const colorTheme =
  localStorage.getItem('colorTheme') || 'purple';

const [uploadingMedia, setUploadingMedia] =
  useState(false);

const [mediaViewer, setMediaViewer] =
  useState(null);
  const [showGroupModal, setShowGroupModal] =
  useState(false);
  const [showGroupInfo, setShowGroupInfo] =
  useState(false);

const [groupName, setGroupName] =
  useState('');

const [selectedMembers, setSelectedMembers] =
  useState([]);
  const scrollRef = useRef(null);

const [followedUsers, setFollowedUsers] =
  useState([]);
const [showAddMembersModal, setShowAddMembersModal] =
  useState(false);

const [availableMembers, setAvailableMembers] =
  useState([]);

const [newMembers, setNewMembers] =
  useState([]);
const [showRenameModal, setShowRenameModal] =
  useState(false);

const [newGroupName, setNewGroupName] =
  useState('');

const [groupAvatarFile, setGroupAvatarFile] =
  useState(null);

const [sidebarWidth, setSidebarWidth] =
  useState(340);


useEffect(() => {

  api.get('/messages/conversations').then(r => {

    setConvs(r.data.conversations);

    if (conversationId) {

      const found = r.data.conversations.find(
        c => c._id === conversationId
      );

      if (found) {
        setActive(found);
      }

    }

  });

}, [conversationId]);
useEffect(() => {

  if (!showGroupModal) return;

  api.get('/users/following').then((res) => {
    setFollowedUsers(res.data.users || []);
  });

}, [showGroupModal]);

  useEffect(() => {
    if (!active) return;
    api.get(`/messages/${active._id}`).then(r => setMessages(r.data.messages));
    const s = getSocket();
    s?.emit('join:conversation', active._id);
   s?.on('message:new', (m) => {
  if (m.conversation === active._id) {
    setMessages(p => {
      if (p.some(msg => msg._id === m._id)) {
        return p;
      }

      return [
  ...p,
  {
    ...m,
    replyTo: m.replyTo || null
  }
];
    });
  }
});
    s?.on('typing', ({ conversationId, from }) => {
      if (conversationId === active._id) { setTyping(from); setTimeout(()=>setTyping(null), 1500); }
    });
    return () => { s?.off('message:new'); s?.off('typing'); };
  }, [active]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 1e9, behavior:'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
   if ((!text.trim() && !mediaFile) || !active)
  return;
   let image = '';
let video = '';

if (mediaFile) {

  setUploadingMedia(true);

  const fd = new FormData();

  fd.append('media', mediaFile);;

  const uploadRes = await api.post(
    '/upload/image',
    fd
  );

  const url = uploadRes.data.url;

  if (mediaFile.type.startsWith('video')) {
    video = url;
  } else {
    image = url;
  }

}

const { data } = await api.post(
  `/messages/${active._id}`,
  {
    text,
    image,
    video,
    replyTo: replyingTo?._id || null
  }
);
    setMessages(p => {
  if (p.some(m => m._id === data.message._id)) {
    return p;
  }
return [
  ...p,
  {
    ...data.message,
    replyTo: replyingTo
  }
];
});
setText('');
setMediaFile(null);
setUploadingMedia(false);
setReplyingTo(null);
  };

  const onType = (e) => {
    setText(e.target.value);
    const other = active?.participants.find(p => p._id !== me._id);
    getSocket()?.emit('typing', { conversationId: active._id, to: other?._id });
  };

  return (
   <div className="card flex h-[75vh] overflow-hidden">
    <aside
  style={{
    width: `${sidebarWidth}px`
  }}
  className={`
    ${active ? 'hidden md:block' : 'block'}
    border-r border-brand-50 dark:border-zinc-800
    overflow-y-auto shrink-0
  `}
>
       <div className="p-4 border-b border-brand-50 dark:border-zinc-800">

  <div className="flex items-center justify-between">

    <h3 className="font-display font-bold">
      Messages
    </h3>

    <div className="flex gap-2">
      

     <button
  onClick={() => setShowGroupModal(true)}
  className={`text-xs px-3 py-1 rounded-lg text-white ${
    colorTheme === 'cozy'
      ? 'bg-[#7DA6D9] hover:bg-[#6B95CA]'
      : 'bg-brand-600 hover:bg-brand-700'
  }`}
>
  + New Group
</button>

    </div>

  </div>

</div>
        {convs.length === 0 && <p className="p-4 text-sm text-ink/50">No conversations yet.</p>}
       {convs.map(c => {

  const other = c.participants.find(
    p => p._id !== me._id
  );

  const title = c.isGroup
    ? c.groupName
    : (other?.fullName || other?.username);

  const avatarName = c.isGroup
    ? c.groupName
    : (other?.fullName || other?.username);
          return (
            <button key={c._id} onClick={()=>setActive(c)} className={`w-full p-3 flex items-center gap-3 hover:bg-brand-50 dark:hover:bg-zinc-800 ${
  active?._id===c._id
    ? 'bg-brand-50 dark:bg-zinc-800'
    : ''
}`}>
           
              <div className="relative">
              <Avatar
  src={
    c.isGroup
      ? c.groupAvatar
      : other?.avatar
  }
  name={avatarName}
/>
           {other?.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"/>}
              </div>
              <div className="flex-1 text-left min-w-0">
               <div className="font-semibold truncate">
  {title}
</div>
               <div className="flex items-center justify-between gap-2">

<div className="text-xs text-ink/50 dark:text-zinc-400 truncate">
    {c.lastMessage?.text || 'Say hi 👋'}
  </div>

  {c.unreadCount > 0 && (
    <div className="min-w-5 h-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center">
      {c.unreadCount}
    </div>
  )}

</div>
              </div>
            </button>
          );
        })}
      </aside>

      <div
  className="
    hidden md:block
    w-1
    cursor-col-resize
    hover:bg-brand-500/30
    transition
  "
  onMouseDown={(e) => {

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const move = (ev) => {

      const next =
        startWidth +
        (ev.clientX - startX);

      setSidebarWidth(
        Math.max(
          280,
          Math.min(
            500,
            next
          )
        )
      );

    };

    const up = () => {

      window.removeEventListener(
        'mousemove',
        move
      );

      window.removeEventListener(
        'mouseup',
        up
      );

    };

    window.addEventListener(
      'mousemove',
      move
    );

    window.addEventListener(
      'mouseup',
      up
    );

  }}
/>
   <section
  className={`
    ${!active ? 'hidden md:flex' : 'flex'}
    flex-1
    flex-col
    min-h-0
    w-full
  `}
>
        {!active && <div className="flex-1 grid place-items-center text-ink/40 dark:text-zinc-500">Select a conversation</div>}
        {active && (
          <>
         <header className="p-3 border-b border-brand-50 dark:border-zinc-800">
  <div className="md:hidden mb-2">
    <button
      onClick={() => setActive(null)}
      className={`
        px-3 py-1.5 rounded-xl text-sm
        ${
          colorTheme === 'cozy'
            ? 'bg-[#24354D] text-white'
            : 'bg-zinc-800 text-white'
        }
      `}
    >
      ← Back
    </button>
  </div>
  {(() => {

    const o = active.participants.find(
      p => p._id !== me._id
    );

    const title = active.isGroup
      ? active.groupName
      : (o?.fullName || o?.username);

    return (

     <div
  onClick={() =>
    active.isGroup &&
    setShowGroupInfo(true)
  }
  className={`flex items-center gap-3 rounded-xl p-2 ${
    active.isGroup
      ? 'cursor-pointer hover:bg-brand-50 dark:hover:bg-zinc-800'
      : ''
  }`}
>
       <Avatar
  src={
    active.isGroup
      ? active.groupAvatar
      : o?.avatar
  }
  name={title}
  size={36}
/>

        <div>

          <div className="font-semibold">
            {title}
          </div>

          <div className="text-xs text-ink/50 dark:text-zinc-400">

            {active.isGroup
              ? `${active.participants.length} members`
              : (o?.isOnline
                  ? 'Online'
                  : 'Offline')}

          </div>

        </div>

      </div>

    );

  })()}
</header>
        <div
  ref={scrollRef}
  className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-brand-50/30 dark:bg-zinc-950"
>
              {messages.map(m => (
  <div
    key={m._id}
  className={`flex ${
  (m.sender?._id || m.sender) === me._id
    ? 'justify-end'
    : 'justify-start'
}`}
  >
    <div
      id={`message-${m._id}`}
      onClick={() => {
        setSelectedMessage(
          selectedMessage?._id === m._id ? null : m
        );
      }}
     className={`relative max-w-[70%] px-4 py-2 rounded-2xl cursor-pointer ${
 (m.sender?._id || m.sender) === me._id
    ? colorTheme === 'cozy'
      ? 'bg-gradient-to-r from-[#7DA6D9] to-[#9FC1E8] text-white rounded-br-sm'
      : 'bg-brand-gradient text-white rounded-br-sm'
    : 'bg-white dark:bg-zinc-800 dark:text-white rounded-bl-sm'
}`}
    >

      <div className="space-y-1">
        {active.isGroup &&
 (m.sender?._id || m.sender) !== me._id && (
  <div className="text-xs font-semibold mb-1 opacity-80">
    {m.sender?.fullName || m.sender?.username}
  </div>
)}

       {m.replyTo?.text && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      const el = document.getElementById(
        `message-${m.replyTo._id}`
      );

      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        el.classList.add(
          'ring-2',
          'ring-brand-400'
        );

        setTimeout(() => {
          el.classList.remove(
            'ring-2',
            'ring-brand-400'
          );
        }, 1500);
      }
    }}
    className="text-xs opacity-70 border-l-2 pl-2 text-left hover:opacity-100"
  >
    {m.replyTo.text}
  </button>
)}
<div className="space-y-2">

  {!!m.text && (
    <div>
      {m.text}
    </div>
  )}


  {m.image && (

  <img
    src={m.image}
    alt=""
    className="rounded-2xl max-w-xs cursor-pointer"
    onClick={() => setMediaViewer(m.image)}
  />

)}

{m.video && (

  <video
    src={m.video}
    controls
    className="rounded-2xl max-w-xs"
    onClick={() => setMediaViewer(m.video)}
  />

)}

 {m.sharedPost && (

  <Link
    to={`/post/${m.sharedPost._id}`}
    className="bg-white/10 border border-white/10 rounded-2xl overflow-hidden w-64 block hover:opacity-90 transition"
  >

    {!!m.sharedPost.images?.[0]?.url && (

      <img
        src={m.sharedPost.images[0].url}
        alt=""
        className="w-full h-44 object-cover"
      />

    )}

    <div className="p-3">

      <div className="font-semibold text-sm">

        {m.sharedPost.author?.fullName ||
          m.sharedPost.author?.username}

      </div>

      <div className="text-xs opacity-70 mb-2">

        @{m.sharedPost.author?.username}

      </div>

      <div className="text-sm line-clamp-3">

        {m.sharedPost.content ||
          'Shared a post'}

      </div>

    </div>

  </Link>

)}

</div>

{(m.sender?._id || m.sender) === me._id && (
  <div className="text-[10px] mt-1 opacity-70 text-right">
   {m.seenBy?.length > 0 ? 'Seen' : 'Sent'}
  </div>
)}

        {selectedMessage?._id === m._id && (
          <div className="flex gap-3 mt-2 text-xs">

            <button
              onClick={(e) => {
                e.stopPropagation();

                setReplyingTo(m);
                setSelectedMessage(null);
              }}
              className="hover:underline"
            >
              Reply
            </button>

            {(m.sender?._id || m.sender) === me._id && (
              <button
               onClick={async (e) => {
                  e.stopPropagation();

                 try {

  await api.delete(
    `/messages/${m._id}/delete`
  );

  setMessages(p =>
    p.filter(msg => msg._id !== m._id)
  );

} catch (e) {

  console.error(e);

}

                  setSelectedMessage(null);
                }}
                className="text-red-300 hover:underline"
              >
                Delete
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  </div>
))}
             {typing && <div className="text-xs text-ink/40 italic">typing…</div>}
            </div>
           <div className="border-t border-brand-50 dark:border-zinc-800 p-3 space-y-2">

  {replyingTo && (
   <div className="bg-brand-50 dark:bg-zinc-800 rounded-xl px-3 py-2 flex items-start justify-between">

      <div>
        <div className="text-xs font-semibold text-brand-700">
          Replying to
        </div>

        <div className="text-sm text-ink/70 line-clamp-1">
          {replyingTo.text}
        </div>
      </div>

      <button
        onClick={() => setReplyingTo(null)}
        className="text-xs text-red-500 hover:underline"
      >
        Cancel
      </button>

    </div>
  )}


  {mediaFile && (

  <div className="bg-brand-50 dark:bg-zinc-800 rounded-xl p-2">

    <div className="text-xs mb-2 opacity-70">
      Selected media
    </div>

    {
      mediaFile.type.startsWith('video') ? (

        <video
          src={URL.createObjectURL(mediaFile)}
          controls
          className="rounded-xl max-h-52"
        />

      ) : (

        <img
          src={URL.createObjectURL(mediaFile)}
          alt=""
          className="rounded-xl max-h-52"
        />

      )
    }

  </div>

)}

  <form onSubmit={send} className="flex gap-2 items-center">
    <label className="btn-outline px-3 cursor-pointer">

  +

  <input
    type="file"
    hidden
    accept="image/*,video/mp4,video/webm,video/mov"
    onChange={(e) =>
      setMediaFile(e.target.files[0])
    }
  />

</label>

    <input
      value={text}
      onChange={onType}
      placeholder="Message…"
      className="input"
      key={active?._id}
    />

    <button className="btn-primary px-4">
      <Send size={16}/>
    </button>

  </form>

</div>
          </>
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

    {
      mediaViewer.includes('.mp4') ||
      mediaViewer.includes('.webm') ||
      mediaViewer.includes('.mov') ? (

        <video
          src={mediaViewer}
          controls
          autoPlay
          className="max-w-full max-h-full rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        />

      ) : (

        <img
          src={mediaViewer}
          alt=""
          className="max-w-full max-h-full rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        />

      )
    }

  </div>

)}

{showGroupModal && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">

   <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 p-6">

      <h2 className="text-xl font-bold mb-4">
        Create Group
      </h2>

      <input
        value={groupName}
        onChange={(e) =>
          setGroupName(e.target.value)
        }
        placeholder="Group name"
        className="input mb-4"
      />
<div className="max-h-60 overflow-y-auto space-y-2 mb-4">

  {followedUsers.map((user) => (

    <button
      key={user._id}
      type="button"
      onClick={() => {

        setSelectedMembers((prev) =>

          prev.includes(user._id)
            ? prev.filter(
                (id) => id !== user._id
              )
            : [...prev, user._id]

        );

      }}
      className={`w-full flex items-center gap-3 p-2 rounded-xl border ${
        selectedMembers.includes(user._id)
          ? colorTheme === 'cozy'
            ? 'border-[#7DA6D9] bg-[#F5FAFF] dark:bg-[#1A2433]'
            : 'border-brand-500 bg-brand-50 dark:bg-zinc-800'
          : 'border-zinc-200 dark:border-zinc-700'
      }`}
    >

      <Avatar
        src={user.avatar}
        name={user.fullName}
        size={32}
      />

      <span>
        {user.fullName || user.username}
      </span>

    </button>

  ))}

</div>

      <div className="flex justify-end gap-3">

        <button
          onClick={() =>
            setShowGroupModal(false)
          }
          className="btn-outline"
        >
          Cancel
        </button>

       <button
  onClick={async () => {
    try {

      const { data } = await api.post(
        '/messages/group',
        {
          name: groupName,
          members: selectedMembers
        }
      );

      setConvs(prev => [
        data.conversation,
        ...prev
      ]);

      setActive(data.conversation);

      setShowGroupModal(false);
      setGroupName('');
      setSelectedMembers([]);

    } catch (err) {
      console.error(err);
    }
  }}
  className="btn-primary"
>
  Create Group
</button>

      </div>

    </div>

  </div>
)}
{showGroupInfo && active?.isGroup && (

  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">

    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6">

     <div className="flex items-center gap-3 mb-4">

  <Avatar
    src={active.groupAvatar}
    name={active.groupName}
    size={48}
  />

  <h2 className="text-xl font-bold">
    {active.groupName}
  </h2>

</div>

      <div className="space-y-3 max-h-72 overflow-y-auto">

        {active.participants.map((member) => (

        <Link
  to={`/profile/${member.username}`}
  key={member._id}
  className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-zinc-800 transition"
>

            <Avatar
              src={member.avatar}
              name={
                member.fullName ||
                member.username
              }
              size={36}
            />

            <div>
     <div className="flex items-center gap-2 flex-wrap">

  {active.admins?.some(
    id => String(id) === String(member._id)
  ) && (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full border ${
        colorTheme === 'cozy'
          ? 'border-[#7DA6D9] text-[#7DA6D9]'
          : 'border-brand-500 text-brand-400'
      }`}
    >
      ADMIN
    </span>
  )}

  {active.admins?.some(
    id => String(id) === String(me._id)
  ) &&
   active.admins?.some(
    id => String(id) === String(member._id)
  ) &&
   String(member._id) !== String(me._id) && (

    <button
      onClick={async (e) => {
        e.preventDefault();

        try {

          await api.patch(
            `/messages/group/${active._id}/demote/${member._id}`
          );

          setActive(prev => ({
            ...prev,
            admins: prev.admins.filter(
              id => String(id) !== String(member._id)
            )
          }));

        } catch (err) {
          console.error(err);
        }
      }}
      className="text-[10px] text-red-400 hover:text-red-300"
    >
      Remove Admin
    </button>

  )}

</div>


<div className="text-xs text-ink/60 dark:text-zinc-400">
  @{member.username}
</div>
{active.admins?.some(
  id => String(id) === String(me._id)
) &&
 String(member._id) !== String(me._id) && (

  <div className="flex gap-2 mt-2">

    {!active.admins?.some(
      id => String(id) === String(member._id)
    ) && (

      <button
        onClick={async (e) => {

          e.preventDefault();

          try {

            await api.patch(
              `/messages/group/${active._id}/admin/${member._id}`
            );

            setActive(prev => ({
              ...prev,
              admins: [
                ...(prev.admins || []),
                member._id
              ]
            }));

          } catch (err) {

            console.error(err);

          }

        }}
        className={`text-xs px-2 py-1 rounded-lg ${
          colorTheme === 'cozy'
            ? 'bg-[#E8F2FF] text-[#5F84B3] dark:bg-[#1A2433]'
            : 'bg-brand-50 text-brand-600 dark:bg-zinc-800'
        }`}
      >
        Make Admin
      </button>

    )}

    <button
      onClick={async (e) => {

        e.preventDefault();

        const ok = window.confirm(
          `Remove ${member.username}?`
        );

        if (!ok) return;

        try {

          await api.delete(
            `/messages/group/${active._id}/remove/${member._id}`
          );

          setActive(prev => ({
            ...prev,
            participants:
              prev.participants.filter(
                p => p._id !== member._id
              ),
            admins:
              (prev.admins || []).filter(
                id => id !== member._id
              )
          }));

        } catch (err) {

          console.error(err);

        }

      }}
      className="text-xs px-2 py-1 rounded-lg text-red-500 border border-red-500"
    >
      Remove
    </button>

  </div>

)}
            </div>

         </Link>

        ))}

      </div>
  <div className="mt-6 border-t border-white/10 pt-5">

  <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-4">
    Group Settings
  </div>

  {active.admins?.some(
    id => String(id) === String(me._id)
  ) && (

    <div className="space-y-1">

      <button
        onClick={() => {
          setNewGroupName(active.groupName);
          setShowRenameModal(true);
        }}
        className={`
          w-full flex items-center justify-between
          px-3 py-2.5 rounded-lg
          transition-all duration-200
          ${
            colorTheme === 'cozy'
              ? 'hover:bg-[#1A2433] text-[#DCEBFF]'
              : 'hover:bg-zinc-800 text-white'
          }
        `}
      >
        <div className="flex items-center gap-2.5">
         <Pencil size={16} />
          <span>Rename Group</span>
        </div>

        <span className="text-zinc-500">
          ›
        </span>
      </button>

      <label
        className={`
          w-full flex items-center justify-between
          px-3 py-2.5 rounded-lg
          cursor-pointer
          transition-all duration-200
          ${
            colorTheme === 'cozy'
              ? 'hover:bg-[#1A2433] text-[#DCEBFF]'
              : 'hover:bg-zinc-800 text-white'
          }
        `}
      >
        <div className="flex items-center gap-2.5">
         <ImageIcon size={16} />
          <span>Change Picture</span>
        </div>

        <span className="text-zinc-500">
          ›
        </span>

        <input
          hidden
          type="file"
          accept="image/*"
          onChange={async (e) => {

            const file =
              e.target.files?.[0];

            if (!file) return;

            try {

              const fd =
                new FormData();

              fd.append(
                'media',
                file
              );

              const upload =
                await api.post(
                  '/upload/image',
                  fd
                );

              const { data } =
                await api.patch(
                  `/messages/group/${active._id}/avatar`,
                  {
                    avatar:
                      upload.data.url
                  }
                );

              setActive(prev => ({
                ...prev,
                groupAvatar:
                  data.conversation.groupAvatar
              }));

              setConvs(prev =>
                prev.map(c =>
                  c._id === active._id
                    ? {
                        ...c,
                        groupAvatar:
                          data.conversation.groupAvatar
                      }
                    : c
                )
              );

            } catch (err) {

              console.error(err);

            }

          }}
        />
      </label>

      <button
        onClick={async () => {

          try {

            const { data } =
              await api.get(
                '/users/following'
              );

            const existingIds =
              active.participants.map(
                p => p._id
              );

            setAvailableMembers(
              data.users.filter(
                u =>
                  !existingIds.includes(
                    u._id
                  )
              )
            );

            setShowAddMembersModal(
              true
            );

          } catch (err) {

            console.error(err);

          }

        }}
        className={`
          w-full flex items-center justify-between
          px-3 py-2.5 rounded-lg
          transition-all duration-200
          ${
            colorTheme === 'cozy'
              ? 'hover:bg-[#1A2433] text-[#DCEBFF]'
              : 'hover:bg-zinc-800 text-white'
          }
        `}
      >
        <div className="flex items-center gap-2.5">
          <UserPlus size={16} />
          <span>Add Members</span>
        </div>

        <span className="text-zinc-500">
          ›
        </span>
      </button>

    </div>

  )}

  <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mt-6 mb-4">
    Danger Zone
  </div>

  <div className="space-y-1">

    <button
      onClick={async () => {

        const ok =
          window.confirm(
            'Leave this group?'
          );

        if (!ok) return;

        try {

          await api.post(
            `/messages/group/${active._id}/leave`
          );

          setConvs(prev =>
            prev.filter(
              c =>
                c._id !== active._id
            )
          );

          setActive(null);
          setShowGroupInfo(false);

        } catch (err) {

          console.error(err);

        }

      }}
     className="
  w-full flex items-center justify-between
  px-3 py-2.5 rounded-lg
  text-red-400
  hover:bg-red-500/10
  transition-all duration-200
"
    >
      <div className="flex items-center gap-2.5">
        <LogOut size={16} />
        <span>Leave Group</span>
      </div>

     <ChevronRight
  size={16}
  className="text-zinc-500"
/>
    </button>

    {active.admins?.some(
      id => String(id) === String(me._id)
    ) && (

      <button
        onClick={async () => {

          const ok =
            window.confirm(
              'Delete this group forever?'
            );

          if (!ok) return;

          try {

            await api.delete(
              `/messages/group/${active._id}`
            );

            setConvs(prev =>
              prev.filter(
                c =>
                  c._id !== active._id
              )
            );

            setActive(null);
            setShowGroupInfo(false);

          } catch (err) {

            console.error(err);

          }

        }}
        className="
          w-full flex items-center justify-between
          px-3 py-2.5 rounded-lg
          text-red-400
          hover:bg-red-500/10
          transition-all duration-200
        "
      >
        <div className="flex items-center gap-2.5">
         <Trash2 size={16} />
          <span>Delete Group</span>
        </div>

       <ChevronRight
  size={16}
  className="text-zinc-500"
/>
      </button>

    )}

  </div>

  <button
    onClick={() =>
      setShowGroupInfo(false)
    }
    className={`
      w-full mt-5 py-2.5 rounded-xl
      transition-all duration-200
      ${
        colorTheme === 'cozy'
          ? 'bg-[#24354D] hover:bg-[#2C4260] text-white'
          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
      }
    `}
  >
    Close
  </button>

</div>

    </div>

  </div>

)}

{showAddMembersModal && (

  <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">

    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6">

      <h2 className="text-xl font-bold mb-4">
        Add Members
      </h2>

      <div className="max-h-72 overflow-y-auto space-y-2">

        {availableMembers.map((user) => (

          <button
            key={user._id}
            onClick={() => {

              setNewMembers(prev =>

                prev.includes(user._id)
                  ? prev.filter(
                      id => id !== user._id
                    )
                  : [...prev, user._id]

              );

            }}
            className={`w-full flex items-center gap-3 p-2 rounded-xl border ${
              newMembers.includes(user._id)
                ? colorTheme === 'cozy'
                  ? 'border-[#7DA6D9] bg-[#1A2433]'
                  : 'border-brand-500 bg-brand-50 dark:bg-zinc-800'
                : 'border-zinc-700'
            }`}
          >

            <Avatar
              src={user.avatar}
              name={user.fullName || user.username}
              size={36}
            />

            <div>
              {user.fullName || user.username}
            </div>

          </button>

        ))}

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setShowAddMembersModal(false)
          }
          className="btn-outline"
        >
          Cancel
        </button>

        <button
          onClick={async () => {

            try {

              for (const userId of newMembers) {

                await api.post(
                  `/messages/group/${active._id}/add/${userId}`
                );

              }

              window.location.reload();

            } catch (err) {

              console.error(err);

            }

          }}
          className="btn-primary"
        >
          Add Selected
        </button>

      </div>

    </div>

  </div>

)}

{showRenameModal && (

  <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center">

    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6">

      <h2 className="text-xl font-bold mb-4">
        Rename Group
      </h2>

      <input
        value={newGroupName}
        onChange={(e) =>
          setNewGroupName(
            e.target.value
          )
        }
        className="input"
      />

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() =>
            setShowRenameModal(false)
          }
          className="btn-outline"
        >
          Cancel
        </button>

        <button
          onClick={async () => {

            try {

              const { data } =
                await api.patch(
                  `/messages/group/${active._id}/name`,
                  {
                    name:
                      newGroupName
                  }
                );

              setActive(prev => ({
                ...prev,
                groupName:
                  data.conversation.groupName
              }));

              setConvs(prev =>
                prev.map(c =>
                  c._id === active._id
                    ? {
                        ...c,
                        groupName:
                          data.conversation.groupName
                      }
                    : c
                )
              );

              setShowRenameModal(false);

            } catch (err) {

              console.error(err);

            }

          }}
          className="btn-primary"
        >
          Save
        </button>

      </div>

    </div>

  </div>

)}
      </section>
    </div>
  );
}
