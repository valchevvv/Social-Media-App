import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../../helper/interfaces";
import { get } from "../../helper/axiosHelper";
import { useLoadingSpinner } from "../../contexts/LoadingSpinnerContext";
import profile_picture from '../../assets/profile_picture.png';

const ExplorePage = () => {
    const { startLoading, stopLoading } = useLoadingSpinner();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        startLoading();
        get('post/explore').then((res) => {
            setPosts(res);
        }).finally(() => {
            stopLoading();
        });
    }, []);

    return (
        <div className="p-4 mobile:pb-20">
            <div className="grid grid-cols-2 gap-4 mobile:grid-cols-3 laptop:grid-cols-3 desktop:grid-cols-4">
                {posts.map(post => (
                    <div 
                        key={post._id} 
                        className="relative group cursor-pointer" 
                        onClick={() => navigate(`/post/${post._id}`)}
                    >
                        <img 
                            src={post.image} 
                            alt={post.author.username} 
                            className="w-full h-36 mobile:h-32 laptop:h-48 object-cover rounded-lg transition-all duration-300" 
                        />
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50 text-white p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end z-10 mobile:hidden"
                        >
                            <div className="flex items-center mb-2">
                                <img 
                                    src={post.author.profilePicture || profile_picture} 
                                    className="w-8 h-8 rounded-full mr-2" 
                                    alt="" 
                                />
                                <span className="font-semibold">{post.author.username}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExplorePage;
