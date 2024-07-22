/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { get } from '../../helper/axiosHelper';
import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoIosArrowBack } from "react-icons/io";
import { useModal } from '../../contexts/ModalContext';
import { post } from '../../helper/axiosHelper';

import { Post } from '../../helper/interfaces';

import profile_picture from '../../assets/profile_picture.png';
import { VscSend } from 'react-icons/vsc';





const PostPreview = () => {
    const location = useLocation();
    const postId = location.pathname.split('/')[2];

    const [postData, setPostData] = useState<Post | null>(null);
    const [newComment, setNewComment] = useState('');

    const { startLoading, stopLoading } = useLoadingSpinner();

    const { showModal } = useModal();

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

    const commentPost = () => {
        startLoading();
        post('comment/', { postId: postData?._id, content: newComment }).then(() => {
            setNewComment('');
            loadData();
        }).catch(error => {
            console.error('Failed to comment post:', error);
        }).finally(() => stopLoading());
    }

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        startLoading();
        get(`/post/${postId}`).then(response => {
            setPostData(response);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            stopLoading();
        });
    }

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
                            <div className='flex flex-row items-center justify-between p-5'>
                                <span className='font-semibold'>{postData.content}</span>
                                <button className='flex flex-row items-center gap-2 border border-black px-2 py-1 rounded-full shadow-gray-200 shadow-xl' onClick={() => {
                                    showModal({
                                        title: 'Likes',
                                        size: 'large',
                                        content: <div className='flex flex-col gap-5 max-h-96 overflow-y-scroll'>
                                            {
                                                postData.likes.map(like => (
                                                    <div key={like._id} className='flex flex-row items-center gap-3'>
                                                        <img src={like.profilePicture || profile_picture} className='w-12 rounded-full' alt="" />
                                                        <span className='font-semibold'>{like.username}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    })
                                }}>
                                    <IoIosHeartEmpty size={22} />
                                    <span>{postData.likes.length}</span>
                                </button>
                            </div>
                            <div className='px-2 flex flex-col gap-2'>
                                <div className="w-full flex p-2 flex-row align-center justify-center items-center gap-3">
                                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full border-r-2 border-gray-300 focus:outline-none" />
                                    <button onClick={() => commentPost()}>
                                        <VscSend size={24} />
                                    </button>
                                </div>
                                <hr />
                                <div className='flex flex-col gap-5 max-h-72 overflow-y-scroll py-5'>
                                    {
                                        postData.comments.map(comment => (
                                            <div key={comment._id} className='flex flex-col over gap-3 shadow border rounded-xl p-2'>
                                                <div className='flex flex-row items-center gap-2'>
                                                    <img src={comment.author.profilePicture || profile_picture} className='w-9 rounded-full' alt="" />
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
                                <button className='flex flex-row items-center gap-2 border border-gray-300 outline-gray-500 px-2 py-1 rounded-full shadow-gray-200 shadow' onClick={() => {
                                    showModal({
                                        title: 'Likes',
                                        size: 'small',
                                        content: <div className='flex flex-col gap-5 max-h-96 overflow-y-scroll'>
                                            {
                                                postData.likes.map(like => (
                                                    <div key={like._id} className='flex flex-row items-center gap-3'>
                                                        <img src={like.profilePicture || profile_picture} className='w-12 rounded-full' alt="" />
                                                        <span className='font-semibold'>{like.username}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    })
                                }}>
                                    <IoIosHeartEmpty size={22} />
                                    <span>{postData.likes.length}</span>
                                </button>
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
                                            e.preventDefault()
                                            commentPost()
                                        }
                                    }}
                                    placeholder="Add a comment..."
                                    className="w-full border-r-2 border-gray-300 focus:outline-none"
                                />
                                <button onClick={() => commentPost()}>
                                    <VscSend size={24} />
                                </button>
                            </div>
                            {
                                postData.comments.length > 0 && <>
                                    <div className='flex flex-col gap-5 max-h-72 overflow-y-scroll pb-5 border-t-2 border-gray-100'>
                                        {
                                            postData.comments.map(comment => (
                                                <div key={comment._id} className='flex flex-col over gap-3 shadow border rounded-xl p-2'>
                                                    <div className='flex flex-row items-center gap-2'>
                                                        <img src={comment.author.profilePicture || profile_picture} className='w-9 rounded-full' alt="" />
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
                                </>
                            }
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

export default PostPreview