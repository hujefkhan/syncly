
import api from '../lib/api';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

export default function ExploreCard({
  post
}){

  const image =
    post.images?.[0]?.url;
 
    const isCozy =
  localStorage.getItem('colorTheme') === 'cozy';
   

    

  return (

    <div
      
    className={`group block overflow-hidden rounded-3xl backdrop-blur border hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 ${
  isCozy
    ? 'bg-[#f8fbff] dark:bg-[#16202d] border-[#d9e6f2] dark:border-[#243447]'
    : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
}`}>

      {/* IMAGE */}

      {!!image && (

       <div className="overflow-hidden relative">

       {image?.match(/\.(mp3|wav|ogg)$/i) ? (

  <div className="flex items-center justify-center bg-zinc-900 text-white rounded-3xl p-10 min-h-[300px]">

    <audio
      src={image}
      controls
      className="w-full"
    />

  </div>

) : image?.match(/\.(mp4|webm|mov)$/i) ? (

 <video
  src={image}
  className={`w-full object-cover group-hover:scale-110 transition duration-700 ${
    post.images?.length > 1
      ? 'h-[420px]'
      : Math.random() > 0.5
        ? 'h-[520px]'
        : 'h-[340px]'
  }`}
  muted
  playsInline
/>

) : (

  <img
    src={image}
    alt=""
    className={`w-full object-cover group-hover:scale-110 transition duration-700 ${
      post.images?.length > 1
        ? 'h-[420px]'
        : Math.random() > 0.5
          ? 'h-[520px]'
          : 'h-[340px]'
    }`}
  />

)}
<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"/>
<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"/>
        </div>

      )}

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-300">
<div className="flex gap-2">

  <button
    onClick={async (e) => {

      e.stopPropagation();

      await api.post(
        `/posts/${post._id}/like`
      );

    }}
    className="w-10 h-10 rounded-full bg-black/70 text-white grid place-items-center backdrop-blur-md"
  >

    <Heart size={16}/>

  </button>

  <button
    onClick={async (e) => {

      e.stopPropagation();

      await api.post(
        `/posts/${post._id}/share`
      );

      post.shareCount =
        (post.shareCount || 0) + 1;

    }}
    className="w-10 h-10 rounded-full bg-black/70 text-white grid place-items-center backdrop-blur-md"
  >

    <Share2 size={16}/>

  </button>

</div>

</div>

{!!post.images?.length && post.images.length > 1 && (

  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs backdrop-blur-md z-10">

    +{post.images.length} photos

  </div>

)}

      {/* CONTENT */}

     <div
  className={`p-5 space-y-4 relative ${
    isCozy
      ? 'bg-[#f8fbff] dark:bg-[#16202d]'
      : 'bg-white dark:bg-zinc-900'
  }`}
>

        {/* USER */}

        <div className="flex items-center gap-3">

          <img
            src={
              post.author?.avatar ||
              `https://ui-avatars.com/api/?name=${post.author?.username}`
            }
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="min-w-0">

           <div className="font-semibold truncate text-black dark:text-white group-hover:text-brand-700 transition">

              {
                post.author?.fullName ||
                post.author?.username
              }

            </div>

           <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">

              @{post.author?.username}

            </div>

          </div>

        </div>

        {/* TEXT */}

        {!!post.images?.length && (

  <div className="flex gap-2 flex-wrap">

  </div>

)}

        {!!post.content && (

          <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed line-clamp-3 tracking-[0.01em]">

            {post.content}

          </p>

        )}

        {/* STATS */}

        <div className="flex items-center gap-5 pt-3 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700">

          <div className="flex items-center gap-1">

            <Heart size={16}/>

            {post.likes?.length || 0}

          </div>

          <div className="flex items-center gap-1">

            <MessageCircle size={16}/>

            {post.commentCount || 0}

          </div>

          <div className="flex items-center gap-1">

            <Share2 size={16}/>

            {post.shareCount || 0}

          </div>

        </div>

      </div>

   </div>

  );

}