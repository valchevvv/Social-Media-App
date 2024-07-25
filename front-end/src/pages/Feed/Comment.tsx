import { useNavigate } from 'react-router-dom';
import profile_picture from '../../assets/profile_picture.png'
import { Comment } from '../../helper/interfaces';

const CommentComponent = ({ comment } : { comment: Comment }) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
    
        if (diffMinutes < 1) {
            return "Just now";
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
        } else {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        }
    };

    return <div className="p-2 shadow rounded-xl">
        <div className="flex flex-row gap-2 items-center cursor-pointer ">
            <img src={comment.author.profilePicture || profile_picture} className='h-7 rounded-full' alt="" />
            <div className='flex flex-col'>
                <span className="font-semibold text-sm content-center hover:underline" onClick={() => navigate(`/profile/${comment.author.username}`)}>{comment.author.username}</span>
                <span className='text-xs text-gray-500'>{formatDate(comment.createdAt)}</span>
            </div>
        </div>
        <div className="pt-3 text-sm font">
            {comment.content}
        </div>
    </div>
}
export default CommentComponent;