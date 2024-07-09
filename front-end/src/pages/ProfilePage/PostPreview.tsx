import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { get } from '../../helper/axiosHelper';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { IoIosHeartEmpty } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';
import { RiMessage3Line } from 'react-icons/ri';
import { VscSend } from 'react-icons/vsc';

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
    comments: string[];
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
        <div className='mobile:pb-20 laptop:w-1/4 laptop:shadow laptop:bg-gray-100 laptop:p-3'>
            {post && (
                <>
                    <div className='py-3 px-2 flex flex-row items-center gap-3'>
                        <img src={post.author.profilePicture} className='w-12 rounded-full' alt="" />
                        <div className='flex flex-col'>
                            <span className='font-semibold'>{post.author.username}</span>
                            <span className='text-gray-500'>{formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <img className='w-full h-auto' src={post.image} alt={post.author.username} />
                        <div className="flex mx-4 mt-3 mb-4">
                            <div className="flex gap-5">
                                <button onClick={() => { }} className='flex flex-row items-center gap-2'>
                                    {
                                        (post.likes.includes("123")) ? <FaHeart color="red" size={22} /> : <IoIosHeartEmpty size={24} />
                                    }
                                    <span>{post.likes.length}</span>
                                </button>
                                <button className='flex flex-row items-center gap-2' onClick={() => { }}>
                                    <RiMessage3Line size={24} />
                                    <span>{post.comments.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}

export default PostPreview