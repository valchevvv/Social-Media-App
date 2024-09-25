import profile_picture from '../../assets/profile_picture.png';
import { formatDate } from '../../helper/functions';
import { Comment } from '../../helper/interfaces';
import { useNavigate } from 'react-router-dom';

const CommentComponent = ({ comment }: { comment: Comment }) => {
  const navigate = useNavigate();

  return (
    <div className="p-2 shadow rounded-xl">
      <div className="flex flex-row gap-2 items-center cursor-pointer ">
        <img
          src={comment.author.profilePicture || profile_picture}
          className="h-7 rounded-full"
          alt=""
        />
        <div className="flex flex-col">
          <span
            className="font-semibold text-sm content-center hover:underline"
            onClick={() => navigate(`/profile/${comment.author.username}`)}
          >
            {comment.author.username}
          </span>
          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
      </div>
      <div className="pt-3 text-sm font">{comment.content}</div>
    </div>
  );
};
export default CommentComponent;
