import { useNavigate } from 'react-router-dom';
import profile_picture from '../../assets/profile_picture.png'
import { Comment } from '../../helper/interfaces';

const CommentComponent = ({ comment } : { comment: Comment }) => {
    const navigate = useNavigate();

    return <div className="p-2 shadow rounded-xl">
        <div className="flex flex-row gap-2 cursor-pointer hover:underline" onClick={() => navigate(`/profile/${comment.author.username}`)}>
            <img src={comment.author.profilePicture || profile_picture} className='h-6' alt="" />
            <span className="font-semibold text-sm content-center">{comment.author.username}</span>
        </div>
        <div className="pt-3 text-sm font">
            {comment.content}
        </div>
    </div>
}
export default CommentComponent;