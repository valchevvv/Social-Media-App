import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { get } from '../../helper/axiosHelper';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { IoIosHeartEmpty } from 'react-icons/io';
import { RiMessage3Line } from 'react-icons/ri';
import { IoIosArrowBack } from "react-icons/io";

interface Comment {
    _id: string;
    author: {
        _id: string;
        username: string;
        profilePicture: string;
    },
    content: string;
    createdAt: string;
}

interface Post {
    _id: string;
    author: {
        _id: string;
        username: string;
        profilePicture: string;
    },
    content: string;
    image: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

const PostPreview = () => {
    const location = useLocation();
    const postId = location.pathname.split('/')[2];

    const [post, setPost] = useState<Post | null>(null);

    const { startLoading, stopLoading } = useLoadingSpinner();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            // Less than 1 day, show in hours
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            return `${diffHours} hours ago`;
        } else if (diffDays < 7) {
            // Less than 7 days, show in days
            return `${diffDays} day${diffDays > 1 ? "s" : ''} ago`;
        } else {
            // Show date in DD MMM format
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${date.getDate()} ${monthNames[date.getMonth()]}`;
        }
    }

    useEffect(() => {
        startLoading();
        get(`/post/${postId}`).then(response => {
            setPost(response);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            stopLoading();
        });
    }, [])

    return (
        <>
            {post && (
                <>
                    <div className='pb-20 laptop:hidden'>
                        <div className='py-3 px-2 flex flex-row items-center gap-3'>
                            <button>
                                <IoIosArrowBack size={24} onClick={() => window.history.back()} />
                            </button>
                            <img src={post.author.profilePicture} className='w-9 rounded-full' alt="" />
                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>{post.author.username}</span>
                                <span className='text-sm text-gray-500'>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col h-full items-center">
                            <img className='px-10 bg-black object-contain' src={post.image} alt={post.author.username} />
                            <div className="flex mx-4 mt-3 mb-4">
                                <div className="flex gap-5">
                                    <button onClick={() => { }} className='flex flex-row items-center gap-2 border border-black px-2 py-1 rounded-full shadow-gray-200 shadow-xl'>
                                        <IoIosHeartEmpty size={22} />
                                        <span>{post.likes.length}</span>
                                    </button>
                                    <button className='flex flex-row items-center gap-2 border border-black px-2 py-1 rounded-full shadow-gray-200 shadow-xl' onClick={() => { }}>
                                        <RiMessage3Line size={24} />
                                        <span>{post.comments.length}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mobile:hidden tablet:hidden laptop:flex flex-row border border-gray-300 w-[80%] shadow-xl'>
                        <div className='flex flex-col w-[70%]'>
                            <div className='py-3 px-2 flex flex-row items-center gap-3'>
                                <button>
                                    <IoIosArrowBack size={24} onClick={() => window.history.back()} />
                                </button>
                                <img src={post.author.profilePicture} className='w-9 rounded-full' alt="" />
                                <div className='flex flex-col'>
                                    <span className='text-sm font-semibold'>{post.author.username}</span>
                                    <span className='text-sm text-gray-500'>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                            <img src={post.image} className='h-96 bg-black aspect-video object-contain' alt="" />
                            <span className='p-4 font-semibold'>{post.content}</span>
                        </div>
                        <div className='w-[30%]'>
                            <div className='flex flex-col border w-full h-full p-3 gap-5'>
                                {
                                    post.comments.map(comment => (
                                        <div key={comment._id} className='flex flex-col gap-3 bg-gray-400 p-2'>
                                            <div className='flex flex-row items-center gap-1'>
                                                <img src={comment.author.profilePicture} className='w-9 rounded-full' alt="" />
                                                <div className='flex flex-col'>
                                                    <span className='font-semibold text-sm'>{comment.author.username}</span>
                                                    <span className='text-xs text-gray-500'>{formatDate(comment.createdAt)}</span>
                                                </div>
                                            </div>
                                            <span className='text-sm px-3'>{comment.content}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

export default PostPreview