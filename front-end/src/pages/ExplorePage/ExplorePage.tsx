import { useEffect, useState } from "react";
import { Post } from "../../helper/interfaces";
import { get } from "../../helper/axiosHelper";
import { useLoadingSpinner } from "../../contexts/LoadingSpinnerContext";
import profile_picture from '../../assets/profile_picture.png';

const ExplorePage = () => {
    const { startLoading, stopLoading } = useLoadingSpinner();

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        startLoading();
        get('post/explore').then((res) => {
            setPosts(res);
        }).finally(() => {
            stopLoading();
        })
    }, [])

    return (
        <div className="flex flex-wrap justify-center p-4">
            {posts.map(post => (
                <div key={post._id} className="flex flex-col items-center bg-white border rounded-lg shadow-md m-2 p-4 max-w-xs w-full">
                    <img src={post.image} alt={post.author.username} className="w-full h-48 object-cover rounded-lg" />
                    <div className="flex items-center mt-4">
                        <img src={post.author.profilePicture || profile_picture} className="w-10 h-10 rounded-full" alt="" />
                        <div className="ml-3">
                            <p className="font-semibold">{post.author.username}</p>
                            <p className="text-gray-500 text-sm">{post.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ExplorePage;
