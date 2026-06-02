import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import api from "../lib/api";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const me = useAuth(s => s.user);
  

  useEffect(() => {
    api.get(`/posts/${postId}`)
      .then((res) => setPost(res.data.post))
      .catch(console.error);
  }, [postId]);

  if (!post) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
    <PostCard
  post={post}
  currentUserId={me?._id}
/>
    </div>
  );
}