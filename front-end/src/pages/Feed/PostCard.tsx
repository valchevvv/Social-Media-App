/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import profile_picture from '../../assets/profile_picture.png';
import { IoIosHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { RiMessage3Line, RiMessage3Fill } from "react-icons/ri";
import { VscSend } from "react-icons/vsc";

import { get } from '../../helper/axiosHelper';
import { AuthContext } from '../../contexts/AuthContext';
import CommentComponent from './Comment';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';

import { Comment } from '../../helper/interfaces';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../helper/interfaces';
import { getSocketIoHelperInstance, SocketIoHelper } from '../../helper/socketIoHelper';

const PostCard = ({ postData, onLike, onComment }: { postData: Post, onLike: () => void, onComment: (postId: string, comment: string) => void }) => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoadingSpinner();
    const navigate = useNavigate();

    const [liked, setLiked] = useState(postData.likes.includes(user!._id) || false);
    const [commenting, setCommenting] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const loadData = async () => {
            startLoading();
            const response = await get(`comment/post/${postData._id}`);
            postData.commentsCount = response.length;
            setComments(response);
            stopLoading();
        };
        loadData();
    }, [postData._id]);

    const likePost = () => {
        setLiked((prevLiked) => !prevLiked);
        onLike();
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            onComment(postData._id, newComment);
            setNewComment('');
        }
    };
    
    const updateComments = (data: Comment) => {
        if(!postData) return;
        setComments((prevComments) => {
            const updatedComments = [
                ...prevComments,
                {
                    content: data.content,
                    author: data.author,
                    createdAt: data.createdAt,
                    _id: data._id,
                    post: postData._id,
                } as Comment,
            ];
            return updatedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
    }

    const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null);
    useEffect(() => {
        if (!user?._id) {
            setSocketIoHelper(null);
        } else {
            const socketHelper = getSocketIoHelperInstance('http://localhost:5001');
            setSocketIoHelper(socketHelper);
        }
    }, [user?._id]);
    
    useEffect(() => {
        if (!user || !socketIoHelper || !postData) return;

        socketIoHelper.on('comment_f', (data) => {
            updateComments(data);
        });


        return () => {
            socketIoHelper.off('comment_f', () => { });
        };
    }, [socketIoHelper, user, location.pathname, postData]);

    return (
        <div className="p-4">
            <div className="bg-white border shadow-sm rounded-xl max-w-md">
                <div className="flex items-center px-4 py-3 cursor-pointer hover:underline" onClick={() => navigate(`/profile/${postData.author.username}`)}>
                    <img className="h-8 w-8 rounded-full" src={postData.author.profilePicture || profile_picture} alt="Profile" />
                    <div className="ml-3">
                        <span className="text-sm font-semibold antialiased block leading-tight">{postData.author.username}</span>
                    </div>
                </div>
                {postData.image && <img className="aspect-video object-cover w-full" src={postData.image} alt="Post" />}
                <div className="px-4 py-3">
                    <div className="font-semibold text-sm">{postData.content}</div>
                </div>
                <div className="flex items-center justify-start mx-4 mt-3 mb-4">
                    <div className="flex gap-5">
                        <button onClick={likePost} className='flex items-center gap-2'>
                            {liked ? <FaHeart color="red" size={22} /> : <IoIosHeartEmpty size={24} />}
                            <span>{postData.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2' onClick={() => setCommenting((prev) => !prev)}>
                            {commenting ? <RiMessage3Fill size={24} /> : <RiMessage3Line size={24} />}
                            <span>{postData.commentsCount}</span>
                        </button>
                    </div>
                </div>
                {commenting && (
                    <>
                        <div className="w-full rounded-xl px-5 py-3 flex items-center gap-3">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
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
                        <div className={`${comments.length > 0 ? "block" : "hidden"} flex flex-col px-5 py-2 pb-6 gap-4 overflow-y-scroll max-h-72`}>
                            {comments.map((commentData, index) => (
                                <CommentComponent key={index} comment={commentData} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostCard;
