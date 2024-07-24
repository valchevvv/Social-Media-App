/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { get } from '../../helper/axiosHelper';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { IoIosHeartEmpty, IoIosArrowBack } from 'react-icons/io';
import { useModal } from '../../contexts/ModalContext';
import profile_picture from '../../assets/profile_picture.png';
import { VscSend } from 'react-icons/vsc';
import { Comment, Like } from '../../helper/interfaces';
import { AuthContext } from '../../contexts/AuthContext';
import { getSocketIoHelperInstance, SocketIoHelper } from '../../helper/socketIoHelper';
import { FaHeart } from 'react-icons/fa';

interface PostLikes {
    _id: string;
    author: {
        _id: string;
        username: string;
        profilePicture: string;
    },
    content: string;
    image: string;
    likes: Like[];
    comments: Comment[];
    createdAt: string;
}

const PostPreview = () => {
    const location = useLocation();
    const postId = location.pathname.split('/')[2];
    const [postData, setPostData] = useState<PostLikes | null>(null);
    const [newComment, setNewComment] = useState('');
    const { startLoading, stopLoading } = useLoadingSpinner();
    const { showModal } = useModal();
    const { user } = useContext(AuthContext);
    const [socketIoHelper, setSocketIoHelper] = useState<SocketIoHelper | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user?._id) {
            const socketHelper = getSocketIoHelperInstance('http://localhost:5001');
            setSocketIoHelper(socketHelper);
        } else {
            setSocketIoHelper(null);
        }
    }, [user?._id]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!user || !socketIoHelper || !postData) return;

        socketIoHelper.on('like_f', updateLikes);
        socketIoHelper.on('comment_f', updateComments);

        return () => {
            socketIoHelper.off('like_f', updateLikes);
            socketIoHelper.off('comment_f', updateComments);
        };
    }, [socketIoHelper, user, postData]);

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

    const updateLikes = (data: {
        sender: {
            id: string,
            username: string
        }, post: string, likeStatus: string
    }) => {
        if (!postData) return;
        let updated = [...postData.likes];

        if (data.likeStatus === "liked" && !postData.likes.find(like => like._id === data.sender.id)) {
            updated.push({ _id: data.sender.id, username: data.sender.username, profilePicture: '' });
        } else if (data.likeStatus === "unliked" && postData.likes.find(like => like._id === data.sender.id)) {
            updated = postData.likes.filter(like => like._id !== data.sender.id);
        }

        setPostData({ ...postData, likes: updated });
    };

    const updateComments = (data: Comment) => {
        if (!postData) return;

        setComments((prevComments) => {
            const updatedComments = [...prevComments, data];
            return updatedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
    };

    const loadData = () => {
        startLoading();
        get(`/post/${postId}`).then(response => {
            setPostData(response);
            get(`comment/post/${postId}`).then(comments => {
                setComments(comments);
            });
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            stopLoading();
        });
    };

    const commentPost = () => {
        if (newComment.trim() !== '') {
            socketIoHelper?.emit('comment_b', { userId: user?._id, postId: postData?._id, content: newComment });
            setNewComment('');
        }
    };

    useEffect(() => {
        if (postData && user) {
            setLiked(postData.likes.some(like => like._id === user._id));
        }
    }, [postData, user]);

    const likePost = () => {
        setLiked(prevLiked => !prevLiked);
        socketIoHelper?.emit('like_b', { userId: user?._id, postId: postData!._id });
    };

    return (
        <>
            {postData && (
                <>
                    <div className='laptop:hidden w-full'>
                        <div className='py-3 px-2 flex flex-row items-center gap-3'>
                            <button>
                                <IoIosArrowBack size={24} onClick={() => window.history.back()} />
                            </button>
                            <img src={postData.author.profilePicture || profile_picture} className='w-9 rounded-full' alt="" />
                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>{postData.author.username}</span>
                                <span className='text-sm text-gray-500'>{formatDate(postData.createdAt)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col h-full">
                            <img className='px-10 bg-black object-contain' src={postData.image} alt={postData.author.username} />
                            <div className='flex flex-row justify-between items-center px-4'>
                                <span className='p-4 font-semibold'>{postData.content}</span>
                                <div className='flex flex-row gap-2 items-center'>
                                    <button onClick={likePost} className='flex flex-row items-center gap-2'>
                                        {liked ? <FaHeart color="red" size={22} /> : <IoIosHeartEmpty size={24} />}
                                    </button>
                                    <span className='underline cursor-pointer' onClick={() => {
                                        showModal({
                                            title: 'Likes',
                                            size: 'large',
                                            content: <div className='flex flex-col gap-5 max-h-96 overflow-y-scroll'>
                                                {postData.likes.map(like => (
                                                    <div key={like._id} className='flex flex-row items-center gap-3'>
                                                        <img src={like.profilePicture || profile_picture} className='w-12 rounded-full' alt="" />
                                                        <span className='font-semibold'>{like.username}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        });
                                    }}>{postData.likes.length} liked</span>
                                </div>
                            </div>
                            <div className='px-2 flex flex-col gap-2'>
                                <div className="w-full flex p-2 flex-row align-center justify-center items-center gap-3">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                commentPost();
                                            }
                                        }}
                                        placeholder="Add a comment..."
                                        className="w-full border-r-2 border-gray-300 focus:outline-none"
                                    />
                                    <button onClick={commentPost}>
                                        <VscSend size={24} />
                                    </button>
                                </div>
                                <hr />
                                <div className='flex flex-col gap-5 max-h-72 overflow-y-scroll py-5'>
                                    {comments.map((comment, index) => (
                                        <div key={index} className='flex flex-col over gap-3 shadow border rounded-xl p-2'>
                                            <div className='flex flex-row items-center gap-2'>
                                                <img src={comment.author.profilePicture || profile_picture} className='w-9 rounded-full' alt="" />
                                                <div className='flex flex-col'>
                                                    <span className='font-semibold text-sm'>{comment.author.username}</span>
                                                    <span className='text-xs text-gray-500'>{formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                            <span className='text-sm px-3'>{comment.content}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mobile:hidden tablet:hidden laptop:flex flex-col border border-gray-300 shadow-xl'>
                        <div className='flex flex-col'>
                            <div className='py-3 px-2 flex flex-row items-center gap-3'>
                                <button>
                                    <IoIosArrowBack size={24} onClick={() => window.history.back()} />
                                </button>
                                <img src={postData.author.profilePicture || profile_picture} className='w-9 rounded-full' alt="" />
                                <div className='flex flex-col'>
                                    <span className='text-sm font-semibold'>{postData.author.username}</span>
                                    <span className='text-sm text-gray-500'>{formatDate(postData.createdAt)}</span>
                                </div>
                            </div>
                            <img src={postData.image} className='h-96 bg-black aspect-video object-contain' alt="" />
                            <div className='flex flex-row justify-between items-center px-4'>
                                <span className='p-4 font-semibold'>{postData.content}</span>
                                <div className='flex flex-row gap-2 items-center'>
                                    <IoIosHeartEmpty size={22} />
                                    <span className='underline cursor-pointer' onClick={() => {
                                        showModal({
                                            title: 'Likes',
                                            size: 'small',
                                            content: <div className='flex flex-col gap-5 max-h-96 overflow-y-scroll'>
                                                {postData.likes.map(like => (
                                                    <div key={like._id} className='flex flex-row items-center gap-3'>
                                                        <img src={like.profilePicture || profile_picture} className='w-12 rounded-full' alt="" />
                                                        <span className='font-semibold'>{like.username}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        });
                                    }}>{postData.likes.length} liked</span>
                                </div>
                            </div>
                        </div>
                        <div className='mb-4 mx-5 flex flex-col gap-2'>
                            <div className="w-full flex p-2 border rounded-xl flex-row align-center justify-center items-center gap-3">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            commentPost();
                                        }
                                    }}
                                    placeholder="Add a comment..."
                                    className="w-full border-r-2 border-gray-300 focus:outline-none"
                                />
                                <button onClick={commentPost}>
                                    <VscSend size={24} />
                                </button>
                            </div>
                            {comments.length > 0 && (
                                <div className='flex flex-col gap-5 max-h-72 overflow-y-scroll pb-5 border-t-2 border-gray-100'>
                                    {comments.map((comment, index) => (
                                        <div key={index} className='flex flex-col over gap-3 shadow border rounded-xl p-2'>
                                            <div className='flex flex-row items-center gap-2'>
                                                <img src={comment.author.profilePicture || profile_picture} className='w-9 rounded-full' alt="" />
                                                <div className='flex flex-col'>
                                                    <span className='font-semibold text-sm'>{comment.author.username}</span>
                                                    <span className='text-xs text-gray-500'>{formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                            <span className='text-sm px-3'>{comment.content}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PostPreview;
