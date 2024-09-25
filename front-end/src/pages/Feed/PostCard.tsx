/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';

import profile_picture from '../../assets/profile_picture.png';
import { AuthContext } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { get } from '../../helper/axiosHelper';
import { formatDate, formatNumber } from '../../helper/functions';
import { Comment, Post } from '../../helper/interfaces';
import { useSocketIoHelper } from '../../hooks/useSocket';
import CommentComponent from './Comment';
import { FaHeart } from 'react-icons/fa';
import { IoIosHeartEmpty } from 'react-icons/io';
import { RiMessage3Fill, RiMessage3Line } from 'react-icons/ri';
import { VscSend } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

const PostCard = ({
  postData,
  onLike,
  onComment,
}: {
  postData: Post;
  onLike: () => void;
  onComment: (postId: string, comment: string) => void;
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [liked, setLiked] = useState(postData.likes.includes(user!._id));
  const [commenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const { socket } = useSocketIoHelper();
  const { showModal } = useModal();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await get(`comment/post/${postData._id}`);
        postData.commentsCount = response.length;
        setComments(response);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [postData._id]);

  const handleNewComment = (data: Comment) => {
    if (data.post !== postData._id) return;
    setComments(prevComments => {
      if (prevComments.some(comment => comment._id === data._id)) return prevComments;

      const updatedComments = [...prevComments, data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return updatedComments;
    });
  };

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.on('comment_f', handleNewComment);

    return () => {
      socket.off('comment_f', handleNewComment);
    };
  }, [socket, user?._id]);

  const likePost = () => {
    setLiked(prev => !prev);
    onLike();
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onComment(postData._id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white border shadow-sm rounded-xl max-w-md">
        <div className="flex items-center px-4 py-3">
          <img
            className="h-8 w-8 rounded-full"
            src={postData.author.profilePicture || profile_picture}
            alt="Profile"
          />
          <div className="ml-3">
            <span
              className="text-sm font-semibold antialiased block leading-tight cursor-pointer hover:underline"
              onClick={() => navigate(`/profile/${postData.author.username}`)}
            >
              {postData.author.username}
            </span>
            <span className="text-xs text-gray-500">{formatDate(postData.createdAt)}</span>
          </div>
        </div>
        {postData.image && (
          <img
            className="aspect-video object-cover w-full"
            src={postData.image}
            alt="Post"
            onClick={() => {
              showModal({
                title: postData.author.username,
                isImagePreview: true,
                content: postData.image,
              });
            }}
          />
        )}
        <div className="px-4 py-3">
          <div className="font-semibold text-sm">{postData.content}</div>
        </div>
        <div className="flex items-center justify-start mx-4 mt-3 mb-4">
          <div className="flex gap-5">
            <button onClick={likePost} className="flex items-center gap-2">
              {liked ? <FaHeart color="red" size={22} /> : <IoIosHeartEmpty size={24} />}
              <span>{formatNumber(postData.likes.length)}</span>
            </button>
            <button
              className="flex items-center gap-2"
              onClick={() => setCommenting(prev => !prev)}
            >
              {commenting ? <RiMessage3Fill size={24} /> : <RiMessage3Line size={24} />}
              <span>{formatNumber(comments.length)}</span>
            </button>
          </div>
        </div>
        {commenting && (
          <>
            <div className="w-full rounded-xl px-5 py-3 flex items-center gap-3">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
                placeholder="Add a comment..."
                className="w-full border-r-2 border-gray-300 focus:outline-none"
              />
              <button onClick={handleCommentSubmit}>
                <VscSend size={24} />
              </button>
            </div>
            {comments.length > 0 && <hr />}
            <div className={`flex flex-col px-5 py-2 pb-6 gap-4 overflow-y-scroll max-h-72`}>
              {comments.map(commentData => (
                <CommentComponent key={commentData._id} comment={commentData} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
