import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../store/auth';

export default function Settings() {
  const { logout } = useAuth();

const [darkMode, setDarkMode] = useState(
  localStorage.getItem('theme') === 'dark'
);
const [colorTheme, setColorTheme] = useState(
  localStorage.getItem('colorTheme') || 'purple'
);


const deleteAccount = async () => {

  const confirmDelete = window.confirm(
    'Are you sure you want to permanently delete your account?'
  );

  if (!confirmDelete) return;

  try {

    await api.delete('/users/me');

    toast.success('Account deleted');

    await logout();

    window.location.href = '/';

  } catch (e) {

    toast.error(
      e?.response?.data?.message ||
      'Could not delete account'
    );

  }

};
useEffect(() => {

  if (darkMode) {

    document.documentElement.classList.add('dark');

    localStorage.setItem('theme', 'dark');

  } else {

    document.documentElement.classList.remove('dark');

    localStorage.setItem('theme', 'light');

  }

}, [darkMode]);


useEffect(() => {

  document.documentElement.classList.remove(
    'theme-purple',
    'theme-cozy'
  );

  if (colorTheme === 'purple') {
    document.documentElement.classList.add(
      'theme-purple'
    );
  }

  if (colorTheme === 'cozy') {
    document.documentElement.classList.add(
      'theme-cozy'
    );
  }

  localStorage.setItem(
    'colorTheme',
    colorTheme
  );

}, [colorTheme]);

  return (
    
    <div className="card p-6 dark:bg-zinc-900 dark:text-white">

      <h1 className="text-2xl font-bold">
        Settings
      </h1>

      <div className="mt-6">

  <h2 className="font-semibold">
    Theme
  </h2>

  <p className="text-sm text-ink/60 dark:text-zinc-400">
    Choose your color palette
  </p>
<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

  <button
    onClick={() => setColorTheme('purple')}
    className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
      colorTheme === 'purple'
        ? 'border-brand-500 shadow-lg scale-[1.02]'
        : 'border-zinc-200 dark:border-zinc-700 hover:border-brand-300'
    }`}
  >
    <div className="font-semibold text-lg">
      Purple
    </div>

    <div className="text-sm text-ink/60 dark:text-zinc-400 mt-1">
      Vibrant • Modern • Creative
    </div>

    <div className="flex gap-2 mt-4">
      <div className="w-5 h-5 rounded-full bg-violet-500" />
      <div className="w-5 h-5 rounded-full bg-fuchsia-500" />
      <div className="w-5 h-5 rounded-full bg-pink-500" />
    </div>
  </button>

  <button
    onClick={() => setColorTheme('cozy')}
    className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
      colorTheme === 'cozy'
        ? 'border-[#8EB6D9] shadow-lg scale-[1.02]'
        : 'border-zinc-200 dark:border-zinc-700 hover:border-[#8EB6D9]'
    }`}
  >
    <div className="font-semibold text-lg">
      Cozy Blue
    </div>

    <div className="text-sm text-ink/60 dark:text-zinc-400 mt-1">
      Calm • Soft • Comfortable
    </div>

    <div className="flex gap-2 mt-4">
      <div className="w-5 h-5 rounded-full bg-[#8EB6D9]" />
      <div className="w-5 h-5 rounded-full bg-[#A8C8E8]" />
      <div className="w-5 h-5 rounded-full bg-[#D9EAF7]" />
    </div>
  </button>

</div>

</div>

   <div className="mt-6 flex items-center justify-between">

  <div>

    <h2 className="font-semibold">
      Dark Mode
    </h2>

    <p className="text-sm text-ink/60 dark:text-zinc-400">
      Toggle app appearance
    </p>

  </div>

  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`w-14 h-8 rounded-full transition flex items-center px-1 ${
      darkMode
        ? 'bg-brand-600 justify-end'
        : 'bg-zinc-300 justify-start'
    }`}
  >

    <div className="w-6 h-6 rounded-full bg-white" />

  </button>

</div>



<div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">

  <h2 className="font-semibold">
    About & Legal
  </h2>

  <div className="mt-4 flex flex-col gap-3">
<Link to="/privacy">Privacy Policy</Link>

<Link to="/terms">Terms of Service</Link>

<Link to="/guidelines">Community Guidelines</Link>

<Link to="/about">About Syncly</Link>

    <p className="text-sm text-ink/60 dark:text-zinc-400">
      Version 1.0.0
    </p>

  </div>

</div>

<div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">

  <h2 className="text-red-500 font-semibold">
    Danger Zone
  </h2>

  <p className="text-sm text-ink/60 dark:text-zinc-400 mt-1">
    Permanently delete your Syncly account
  </p>

  <button
    onClick={deleteAccount}
    className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
  >
    Delete Account
  </button>

</div>
    </div>
  );
}