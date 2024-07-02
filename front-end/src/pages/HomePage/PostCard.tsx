import { useContext, useState } from 'react';
import profile_picture from '../../assets/profile_picture.png'
import { IoIosHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { RiMessage3Line } from "react-icons/ri";
import { VscSend } from "react-icons/vsc";

import { FaBookmark } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";


import { post } from '../../helper/axiosHelper';
import { AuthContext } from '../../contexts/AuthContext';



interface Post {
    _id: string,
    author: {
        _id: string,
        username: string,
        profilePicture: string
    },
    content: string,
    image: string,
    likes: string[],
    likesCount: number
}

const PostCard = ({ postData }: { postData: Post }) => {

    const { user } = useContext(AuthContext);

    const [liked, setLiked] = useState(postData.likes.includes(user!._id) || false);
    const [boomMarked, setBooMarked] = useState(false);

    const likePost = () => {
        post('post/like', { postId: postData._id, liked: !liked }).then(response => {
            console.log(response);
        }).catch(error => {
            console.error('Failed to like post:', error);
        });
        postData.likesCount += liked ? -1 : 1;
        setLiked(liked => !liked);
    }

    return (
        <div className="p-4">
            <div className="bg-white border shadow-sm rounded-xl max-w-md">
                <div className="flex items-center px-4 py-3">
                    <img className="h-8 w-8 rounded-full" src={postData.author.profilePicture || profile_picture} />
                    <div className="ml-3 ">
                        <span className="text-sm font-semibold antialiased block leading-tight">{postData.author.username}</span>
                    </div>
                </div>
                {
                    postData.image && <img className="w-full" src={postData.image} />
                }
                <div className="px-4 py-3">
                    <div className="font-semibold text-sm">{postData.content}</div>
                </div>
                <div className="flex items-center align-center justify-between mx-4 mt-3 mb-2">
                    <div className="flex gap-5">
                        <button onClick={likePost}>
                        {
                            liked ? <FaHeart color="red" size={22} /> : <IoIosHeartEmpty size={24}  />
                        }
                        </button>
                        <button>
                            <RiMessage3Line size={24} />
                        </button>
                        <button>
                        <VscSend size={24} />
                        </button>
                    </div>
                    <div className="flex">
                        <button onClick={() => setBooMarked(boomMarked => !boomMarked)}>
                        {
                            boomMarked ? <FaBookmark size={24} /> : <IoBookmarkOutline size={24} />
                        }
                        </button>
                    </div>
                </div>
                <div className="font-semibold text-sm mx-4 mt-2 mb-4">{postData.likesCount} likes</div>
            </div>
        </div>
    )
}

export default PostCard;