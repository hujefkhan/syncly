import { useState } from 'react';
import { ImagePlus, Send , Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Avatar from './Avatar';
import { useAuth } from '../store/auth';

export default function CreatePost({ onCreated }) {
  const user = useAuth(s => s.user);
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [postType, setPostType] =
  useState('post');
  const [tagInput, setTagInput] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (value) => {

  setTagInput(value);

  if (!value.trim()) {

    setSearchResults([]);

    return;

  }

  try {

    const { data } = await api.get(
      `/search/users?q=${value}`
    );

    setSearchResults(
      data.users || []
    );

  } catch {

    setSearchResults([]);

  }

};

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !files.length) return;
    setBusy(true);
    try {
     const fd = new FormData();

fd.append('content', content);
fd.append('type', postType);
      fd.append(
  'taggedUsers',
  JSON.stringify(
    taggedUsers.map(u => u._id)
  )
);
      files.forEach(f => fd.append('images', f));
      const { data } = await api.post('/posts', fd, { headers: {'Content-Type':'multipart/form-data'} });
     
 onCreated?.(data.post);
 setContent('');
 setFiles([]);
 setTaggedUsers([]);
 setTagInput('');
      toast.success('Posted!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to post'); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card p-5">

  <div className="flex gap-3">

    <Avatar
      src={user?.avatar}
      name={user?.fullName || user?.username}
    />

    <div className="flex-1 space-y-3">

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's syncing today? Add #hashtags…"
        className="w-full resize-none bg-transparent outline-none text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-zinc-500"
        rows={3}
        maxLength={2000}
      />
<div className="space-y-2">

  <div className="flex items-center gap-2">

    <Tag
      size={16}
      className={
  isCozy
    ? 'text-[#8EB6D9]'
    : 'text-brand-600'
}
    />

    <input
      value={tagInput}
      onChange={(e) =>
        searchUsers(e.target.value)
      }
      placeholder="Tag users..."
      className="bg-transparent outline-none text-sm dark:text-white"
    />

  </div>

  {!!taggedUsers.length && (

    <div className="flex flex-wrap gap-2">

      {taggedUsers.map(u => (

        <div
          key={u._id}
          className="px-3 py-1 rounded-full bg-brand-100 dark:bg-zinc-800 text-sm"
        >

          @{u.username}

        </div>

      ))}

    </div>

  )}

  {!!searchResults.length && (

    <div className="bg-white dark:bg-zinc-900 border border-brand-100 dark:border-zinc-800 rounded-xl overflow-hidden">

      {searchResults.map(u => (

        <button
          type="button"
          key={u._id}
          onClick={() => {

            if (
              taggedUsers.some(
                t => t._id === u._id
              )
            ) return;

            setTaggedUsers(prev => [
              ...prev,
              u
            ]);

            setTagInput('');

            setSearchResults([]);

          }}
          className="w-full px-4 py-2 text-left hover:bg-brand-50 dark:hover:bg-zinc-800"
        >

          @{u.username}

        </button>

      ))}

    </div>

  )}

</div>

<div className="flex gap-2 flex-wrap">

  {[
    'post',
    'art',
    'reel',
    'audio'
  ].map(type => (

    <button
      key={type}
      type="button"
      onClick={() =>
        setPostType(type)
      }
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
       postType === type
  ? (
      isCozy
        ? 'bg-[#8EB6D9] text-white'
        : 'bg-brand-gradient text-white'
    )
  : 'bg-zinc-100 dark:bg-zinc-800'
      }`}
    >

      {type}

    </button>

  ))}

</div>
      {!!files.length && (

        <div className="text-xs text-ink/60 dark:text-zinc-400">
          {files.length} image(s) selected
        </div>

      )}

      <div className="flex items-center justify-between pt-2 border-t border-brand-50 dark:border-zinc-800">

        <label className={`cursor-pointer flex items-center gap-2 text-sm font-medium ${
  isCozy
    ? 'text-[#8EB6D9]'
    : 'text-brand-600 hover:text-brand-700'
}`}>

          <ImagePlus size={18} />

          Add photos

          <input
            type="file"
           accept="image/*,video/*,audio/*"
            multiple
            hidden
            onChange={(e) =>
              setFiles([...e.target.files].slice(0, 4))
            }
          />

        </label>

        <button
          disabled={busy}
          className="btn-primary text-sm py-2 px-4"
        >

          <Send size={16} />

          Post

        </button>

      </div>

    </div>

  </div>

</form>
  );
}
