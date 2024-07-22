import { useNavigate } from "react-router-dom";


import { Post } from '../../helper/interfaces';

interface PostsProps {
  posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-1 p-4">
      {posts.map(post => (
        <div key={post._id} className="relative group aspect-square">
          {
            post.image ? <img onClick={() => navigate(`/post/${post._id}`)} className="w-full h-full object-cover absolute top-0 left-0" src={post.image} alt={post.author.username} /> 
            :
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm">
                {post.content}
              </div>
          }

        </div>
      ))}
    </div>
  );
};

export default Posts;