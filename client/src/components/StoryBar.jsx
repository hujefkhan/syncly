import { Trash2 } from 'lucide-react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import Avatar from './Avatar';
import { Plus } from 'lucide-react';
import { useAuth } from '../store/auth';
import toast from 'react-hot-toast';

export default function StoryBar() {

  const user = useAuth(s => s.user);
  const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';

  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const currentUserStories = activeStory
  ? stories.filter(
      s =>
        s.author?._id ===
        activeStory.author?._id
    )
  : [];

  const fileRef = useRef();

  useEffect(() => {

    api
      .get('/stories')
      .then(r => setStories(r.data.stories))
      .catch(() => {});

  }, []);

  const uploadStory = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      const fd = new FormData();

      fd.append('story', file);

      await api.post(
        '/stories',
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

    
      toast.success('Story added!');

      const { data } = await api.get('/stories');

      setStories(data.stories);

    } catch {

      toast.error('Failed to upload story');

    }

  };

  useEffect(() => {

  if (!activeStory) return;

  const timer = setTimeout(() => {

    const currentIndex = stories.findIndex(
      s => s._id === activeStory._id
    );

    const nextStory = stories[currentIndex + 1];

    if (!nextStory) {

      setActiveStory(null);

      return;

    }

    setActiveStory(nextStory);

    setStoryIndex(currentIndex + 1);

  }, 5000);

  return () => clearTimeout(timer);

}, [activeStory, stories]);


const deleteStory = async () => {

  try {

    await api.delete(
      `/stories/${activeStory._id}`
    );

    const updatedStories =
      stories.filter(
        s => s._id !== activeStory._id
      );

    setStories(updatedStories);

    // close if no stories left
    if (updatedStories.length === 0) {

      setActiveStory(null);

      return;

    }

    // move to next story
    const nextStory =
      updatedStories[storyIndex] ||
      updatedStories[storyIndex - 1];

    setActiveStory(nextStory);

  } catch (err) {

    console.error(err);

  }

};

  return (

    <div className="card p-4 overflow-x-auto">

      <div className="flex gap-4 min-w-max">

        <button
          onClick={() => fileRef.current.click()}
          className="flex flex-col items-center gap-2"
        >

          <div className={`w-16 h-16 rounded-full p-[2px] ${
  isCozy
    ? 'bg-[#8EB6D9]'
    : 'bg-brand-gradient'
}`}>

            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">

            <Plus
  className={
    isCozy
      ? 'text-[#8EB6D9]'
      : 'text-brand-600'
  }
/>

            </div>

          </div>

          <span className="text-xs dark:text-zinc-300">
            Your Story
          </span>

        </button>

        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={uploadStory}
        />

       {stories.filter(
  (story, index, self) =>
    index === self.findIndex(
      s =>
        s.author._id ===
        story.author._id
    )
).map((story, i) => (

          <button
  key={story._id}

  onClick={async () => {
const realIndex = stories.findIndex(
  s => s._id === story._id
);

setStoryIndex(realIndex);

setActiveStory(stories[realIndex]);

    try {

      await api.post(
        `/stories/${story._id}/view`
      );

    } catch {}

  }}
  className="flex flex-col items-center gap-2"
>

  <div className={`w-16 h-16 rounded-full p-[2px] ${
  isCozy
    ? 'bg-[#8EB6D9]'
    : 'bg-brand-gradient'
}`}>

    <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 p-[2px]">

      <Avatar
        src={story.author?.avatar}
        name={
          story.author?.fullName ||
          story.author?.username
        }
        size={56}
      />

    </div>

  </div>

  <span className="text-xs max-w-[70px] truncate dark:text-zinc-300">

    {story.author?.username}

  </span>

</button>

        ))}

      </div>
      {activeStory && (

  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">

    <div
      className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-30"
      style={{
        backgroundImage: `url(${activeStory.media?.url})`
      }}
    />

    <div className="relative w-full max-w-md h-full flex flex-col justify-center">

      <div className="absolute top-0 left-0 right-0 p-4 z-20">

        <div className="flex gap-1 mb-3">

  {currentUserStories.map((_, i) => (

    <div
      key={i}
      className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
    >

      <div
        className={`h-full bg-white ${
          currentUserStories.findIndex(
            s => s._id === activeStory._id
          ) === i
            ? 'animate-story'
            : ''
        }`}
      />

    </div>

  ))}

</div>
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Avatar
              src={activeStory.author?.avatar}
              name={
                activeStory.author?.fullName ||
                activeStory.author?.username
              }
              size={40}
            />

            <div>

              <p className="text-white font-semibold">

                {activeStory.author?.username}

              </p>

            </div>

          </div>

         <div className="flex items-center gap-4">

  {user?._id === activeStory?.author?._id && (

    <button
      onClick={deleteStory}
      className="text-white"
    >

      <Trash2 size={28} />

    </button>

  )}

  <button
    onClick={() => setActiveStory(null)}
    className="text-white"
  >

    <X size={28} />

  </button>

</div>

        </div>

      </div>

      <div className="relative flex items-center justify-center h-full px-6">

        <button
          onClick={() => {

            if (storyIndex === 0) return;

            setStoryIndex(storyIndex - 1);

            setActiveStory(
              stories[storyIndex - 1]
            );

          }}
          className="absolute left-3 text-white z-20"
        >

          <ChevronLeft size={40} />

        </button>

        <img
          src={activeStory.media?.url}
          alt="story"
          className="max-h-[85vh] w-full object-contain rounded-3xl"
        />

        <button
          onClick={() => {

            if (storyIndex >= stories.length - 1) {

              setActiveStory(null);

              return;

            }
 
            setStoryIndex(storyIndex + 1);

            setActiveStory(
              stories[storyIndex + 1]
            );

          }}
          className="absolute right-3 text-white z-20"
        >

          <ChevronRight size={40} />

        </button>

      </div>

    </div>

  </div>

)}
    </div>

  );

}