import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, Users, Layers, HeartHandshake, Brain, ArrowRight, Play } from 'lucide-react';
import Logo from '../components/Logo';

const Feature = ({ icon: Icon, title, body }) => (
  <div className="card p-6 hover:shadow-glow transition">
   <div
  className={`w-11 h-11 rounded-xl grid place-items-center text-white mb-4 ${
    localStorage.getItem('colorTheme') === 'cozy'
      ? 'bg-gradient-to-br from-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-brand-gradient'
  }`}
>
  <Icon size={22} /></div>
   <h3 className="font-display font-bold text-lg mb-1.5 text-white">
  {title}
</h3>

<p className="text-white/70 text-sm leading-relaxed">
  {body}
</p>
  </div>
);

const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

export default function Landing() {
  return (
   <div
  className={`min-h-screen ${
    isCozy
      ? 'bg-[#eef5fc]'
      : 'bg-lavender'
  }`}
>
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          <a href="#features">Features</a><a href="#about">About Syncly</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost text-sm">Log in</Link>
          <Link to="/register" className="btn-primary text-sm">Join Syncly</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="chip mb-5"><Sparkles size={14} /> New: Real-time Audio Spaces</span>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Socializing,<br/>
           <span
  className={`bg-clip-text text-transparent ${
    isCozy
      ? 'bg-gradient-to-r from-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-brand-gradient'
  }`}
>
  Perfectly Synced.
</span>
          </h1>
          <p className="mt-6 text-ink/60 text-lg max-w-xl">
            Experience a warmer, more intentional social network. Connect with creators, join communities, and share moments in a space designed for clarity and joy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">Start Syncing Now <ArrowRight size={18} /></Link>
            <button className="btn-outline"><Play size={16} /> Watch Demo</button>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-ink/60">
            <div className="flex -space-x-2">
              {['7C3AED','EC4899','F59E0B','10B981','3B82F6'].map(c=>(
                <div key={c} style={{background:`#${c}`}} className="w-8 h-8 rounded-full ring-2 ring-white" />
              ))}
            </div>
            Joined by 50k+ creators this month
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-brand-gradient blur-3xl opacity-20 rounded-full" />
          <div className="relative card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">✨ Live Moments</h3>
              <button
  className={`text-sm font-medium ${
    isCozy
      ? 'text-[#6F8FB8]'
      : 'text-brand-600'
  }`}
>
  Explore All Stories
</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {['Cristina','Elena','Marcus','Sasha','Jordan','Aria','Leo','Mia'].map((n,i)=>(
                <div key={n} className="flex-shrink-0 text-center">
                 <div
  className={`w-16 h-16 rounded-full p-[2px] ${
    isCozy
      ? 'bg-gradient-to-br from-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-brand-gradient'
  }`}
>
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                     <div
  className={`w-full h-full rounded-full grid place-items-center text-white font-bold ${
    isCozy
      ? 'bg-gradient-to-br from-[#a7c5e6] to-[#8EB6D9]'
      : 'bg-gradient-to-br from-brand-300 to-pink-300'
  }`}
>{n[0]}</div>
                    </div>
                  </div>
                 <div
  className={`text-xs mt-1.5 ${
    isCozy
      ? 'text-[#6F8FB8]'
      : 'text-ink/70'
  }`}
>
  {n}
</div>
                </div>
              ))}
            </div>
           <div
  className={`rounded-xl h-64 grid place-items-center text-white ${
    isCozy
      ? 'bg-gradient-to-br from-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-gradient-to-br from-brand-400 to-pink-400'
  }`}
>
              <div className="text-center">
                <div className="text-5xl mb-2">📸</div>
                <div className="font-display font-bold text-xl">Sarah Jenkins</div>
            <div className="text-sm text-white/90">
  Just posted a new story!
</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12 max-w-2xl mx-auto">
         <h2
  className={`font-display font-extrabold text-4xl ${
    isCozy ? 'text-[#6F8FB8]' : 'text-ink'
  }`}
>
  Why Syncly?
</h2>
          <p className="mt-4 text-ink/60">We've rebuilt the social experience from the ground up to focus on what truly matters: authentic connection.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature icon={ShieldCheck} title="Privacy First" body="Your data is yours. End-to-end encryption for messages and granular visibility controls." />
          <Feature icon={Zap} title="Lightning Fast" body="Optimized for performance. Share high-res media instantly with lag-free scrolling." />
          <Feature icon={Users} title="Community Driven" body="Join curated spaces tailored to your interests. Find your tribe and grow together." />
          <Feature icon={Layers} title="Multi-format Content" body="From long-form blogs to quick stories and audio rooms, express yourself your way." />
          <Feature icon={HeartHandshake} title="Wellness Minded" body="No toxic algorithms. Custom notification schedules and Quiet Mode for digital peace." />
          <Feature icon={Brain} title="AI Enhanced" body="Smart tools to curate your feed, discover creators, and enhance your photos automatically." />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display font-extrabold text-4xl">Express yourself in<span
  className={`bg-clip-text text-transparent ${
    isCozy
      ? 'bg-gradient-to-r from-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-brand-gradient'
  }`}
>
  Vivid Detail.
</span></h2>
          <p className="mt-5 text-ink/60 text-lg">Syncly's interface is designed to make your content shine. With native support for 4K video, lossless audio, and immersive canvas layouts, your creativity has no boundaries.</p>
          <ul className="mt-6 space-y-3 text-ink/70">
            <li className="flex gap-3"><span
  className={
    isCozy
      ? 'text-[#7ea5cf]'
      : 'text-brand-600'
  }
>
  ✓
</span> Interactive threading for deeper conversations</li>
            <li className="flex gap-3"><span
  className={
    isCozy
      ? 'text-[#7ea5cf]'
      : 'text-brand-600'
  }
>
  ✓
</span> Seamless cross-platform sharing features</li>
            <li className="flex gap-3"><span
  className={
    isCozy
      ? 'text-[#7ea5cf]'
      : 'text-brand-600'
  }
>
  ✓
</span> Curated daily inspiration feed</li>
          </ul>
          <Link to="/register" className="btn-primary mt-8">Start Creating</Link>
        </div>
       <div
  className={`card p-6 ${
    isCozy
      ? 'bg-gradient-to-br from-[#eef5fc] to-[#dce8f4]'
      : 'bg-gradient-to-br from-brand-50 to-pink-50'
  }`}
>
          <div className="bg-white rounded-2xl p-5 shadow-soft">
            <div className="flex items-center gap-3 mb-3">
             <div
  className={`w-10 h-10 rounded-full ${
    isCozy
      ? 'bg-gradient-to-br from-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-brand-gradient'
  }`}
/>
              <div><div className="font-semibold">Sarah Jenkins</div><div className="text-xs text-ink/50 dark:text-zinc-400">Just posted a new story!</div></div>
            </div>
           <div
  className={`h-48 rounded-xl ${
    isCozy
      ? 'bg-gradient-to-br from-[#b8d1ea] via-[#8EB6D9] to-[#6F8FB8]'
      : 'bg-gradient-to-br from-pink-300 via-brand-400 to-indigo-400'
  }`}
/>
          </div>
        </div>
      </section>

      <section id="about" className="max-w-4xl mx-auto px-6 py-20 text-center">
       <div
  className={`card p-12 text-center ${
    isCozy
      ? 'bg-[#dce8f4]'
      : 'bg-brand-gradient text-white'
  }`}
>
          <h2 className="font-display font-extrabold text-4xl">Ready to join the sync?</h2>
          <p className="mt-4 opacity-90 max-w-xl mx-auto">Join thousands of creators who have found their new home. Syncly is free to use, and always will be.</p>
         <Link
  to="/register"
  className={`inline-block mt-7 px-7 py-3 rounded-xl font-semibold hover:shadow-2xl transition ${
    isCozy
      ? 'bg-white text-[#6F8FB8]'
      : 'bg-white text-brand-700'
  }`}
>
  Create Account
</Link>
          <p className="mt-3 text-sm opacity-80">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      <footer className="border-t border-brand-100 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <Logo />
            <p className="mt-3 text-ink/60">Connecting creators and communities through a warmer, more synchronized social experience.</p>
          </div>
         <div>
  <h4 className="font-semibold mb-3">Product</h4>

  <ul className="space-y-2 text-ink/60">
    <li>
      <Link to="/features" className="hover:text-brand-500">
        Features
      </Link>
    </li>

    <li>
      <Link to="/guidelines" className="hover:text-brand-500">
        Safety
      </Link>
    </li>

    <li>
      <Link to="/register" className="hover:text-brand-500">
        Mobile App
      </Link>
    </li>
  </ul>
</div>

<div>
  <h4 className="font-semibold mb-3">Company</h4>

  <ul className="space-y-2 text-ink/60">
    <li>
      <Link to="/about" className="hover:text-brand-500">
        About Us
      </Link>
    </li>

    <li>
      <Link to="/about" className="hover:text-brand-500">
        Careers
      </Link>
    </li>

    <li>
      <Link to="/about" className="hover:text-brand-500">
        Contact
      </Link>
    </li>
  </ul>
</div>

<div>
  <h4 className="font-semibold mb-3">Legal</h4>

  <ul className="space-y-2 text-ink/60">
    <li>
      <Link to="/privacy" className="hover:text-brand-500">
        Privacy Policy
      </Link>
    </li>

    <li>
      <Link to="/terms" className="hover:text-brand-500">
        Terms of Service
      </Link>
    </li>

    <li>
      <Link to="/privacy" className="hover:text-brand-500">
        Cookie Policy
      </Link>
    </li>
  </ul>
</div>
        </div>
        <div className="text-center text-xs text-ink/40 py-5 border-t border-brand-50">© 2026 Syncly Inc.</div>
      </footer>
    </div>
  );
}
