import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../store/auth';
import Avatar from '../components/Avatar';

export default function EditProfile() {

  const { user, setUser } = useAuth();

 const [form, setForm] = useState({
  fullName: user?.fullName || '',
  bio: user?.bio || '',
  socialLinks: user?.socialLinks || {},
  isPrivate: user?.isPrivate || false,
});

useEffect(() => {
  if (!user) return;

  setForm({
    fullName: user.fullName || '',
    bio: user.bio || '',
    socialLinks: user.socialLinks || {},
    isPrivate: user.isPrivate || false,
  });
}, [user]);

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [username, setUsername] = useState(
  user?.username || ''
);


const [changingUsername, setChangingUsername] =
  useState(false);

  const changeUsername = async () => {

  try {

    setChangingUsername(true);

    const { data } = await api.patch(
      '/users/me/username',
      { username }
    );

    setUser(data.user);

    toast.success('Username updated');

  } catch (e) {

    toast.error(
      e?.response?.data?.message ||
      'Could not update username'
    );

  } finally {

    setChangingUsername(false);

  }

};

  const save = async (e) => {

    e.preventDefault();

    try {

      let avatar = user.avatar;
      let cover = user.cover;

      if (avatarFile) {

        const fd = new FormData();

        fd.append('media', avatarFile);

        const { data } = await api.post('/upload/image', fd);

        avatar = data.url;
        }

if (coverFile) {

  const fd = new FormData();

  fd.append('media', coverFile);

  const { data } = await api.post('/upload/image', fd);

  cover = data.url;

      }

      const { data } = await api.patch(
        '/users/me/profile',
        {
          ...form,
          avatar, cover
        }
      );
    console.log(data.user);
      setUser(data.user);

      toast.success('Profile updated');

    } catch (e) {

      toast.error('Could not save');

    }

  };

  return (

    <form
      onSubmit={save}
      className="card p-6 max-w-2xl space-y-5"
    >

      <h2 className="font-display font-bold text-2xl dark:text-white">
        Account Settings
      </h2>
<div>

  <label className="text-xs font-semibold tracking-wider text-ink/70 dark:text-zinc-400">
    PROFILE COVER
  </label>

  <div className="mt-3">

    <div className="h-40 rounded-2xl overflow-hidden bg-brand-gradient relative">

      {
        (coverFile || user?.cover) && (

          <img
            src={
              coverFile
                ? URL.createObjectURL(coverFile)
                : user?.cover
            }
            alt="cover"
            className="w-full h-full object-cover"
          />

        )
      }

    </div>

    <label className="btn-outline text-sm cursor-pointer mt-3 inline-flex">

      Change Cover

      <input
        type="file"
        hidden
        accept="image/*"
        onChange={e => setCoverFile(e.target.files[0])}
      />

    </label>

  </div>

</div>
      <div className="flex items-center gap-4">

        <Avatar
          src={user?.avatar}
          name={user?.fullName || user?.username}
          size={72}
        />

        <label className="btn-outline text-sm cursor-pointer">

          Change photo

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={e => setAvatarFile(e.target.files[0])}
          />

        </label>

      </div>

      <div>


        <div>

  <label className="text-xs font-semibold tracking-wider text-ink/70 dark:text-zinc-400">
    USERNAME
  </label>

  <div className="flex gap-3 mt-2">

    <input
      value={username}
      onChange={e => setUsername(e.target.value)}
      className="input"
    />

    <button
      type="button"
      onClick={changeUsername}
      disabled={changingUsername}
      className="btn-outline whitespace-nowrap"
    >

      {
        changingUsername
          ? 'Saving...'
          : 'Change'
      }

    </button>

  </div>

  {
    user?.lastUsernameChange &&
    user?.usernameChangeCount > 0 && (

      <p className="text-xs text-ink/60 dark:text-zinc-400 mt-2">

        Username can only be changed once every 15 days

      </p>

    )
  }

</div>

        <label className="text-xs font-semibold tracking-wider text-ink/70 dark:text-zinc-400">
          FULL NAME
        </label>

        <input
          value={form.fullName}
          onChange={e =>
            setForm(f => ({
              ...f,
              fullName: e.target.value
            }))
          }
          className="input mt-2"
        />

      </div>

      <div>

        <label className="text-xs font-semibold tracking-wider text-ink/70 dark:text-zinc-400">
          BIO
        </label>

        <textarea
          value={form.bio}
          onChange={e =>
            setForm(f => ({
              ...f,
              bio: e.target.value
            }))
          }
          rows={3}
          maxLength={200}
          className="input mt-2"
        />

      </div>

      <div className="grid sm:grid-cols-2 gap-4">

        {['website', 'twitter', 'instagram', 'github'].map(k => (

          <div key={k}>

            <label className="text-xs font-semibold tracking-wider text-ink/70 dark:text-zinc-400">
              {k.toUpperCase()}
            </label>

            <input
              value={form.socialLinks[k] || ''}
              onChange={e =>
                setForm(f => ({
                  ...f,
                  socialLinks: {
                    ...f.socialLinks,
                    [k]: e.target.value
                  }
                }))
              }
              className="input mt-2"
            />

          </div>

        ))}

      </div>

      <div className="flex items-center justify-between">
  <div>
    <h3 className="font-semibold">
      Private Account
    </h3>

    <p className="text-sm text-zinc-500">
      Only approved followers can see your posts.
    </p>
  </div>

 <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only peer"
    checked={form.isPrivate}
    onChange={(e) =>
      setForm(f => ({
        ...f,
        isPrivate: e.target.checked
      }))
    }
  />

  <div className="w-12 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-purple-600 transition-all after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></div>
</label>
</div>

      <button className="btn-primary">
        Save changes
      </button>

    </form>

  );

}