import profile_picture from '../../assets/profile_picture.png'

const CommentComponent = () => {
    return <div className="p-2 shadow rounded-xl">
        <div className="flex flex-row gap-2 ">
            <img src={profile_picture} className='h-6' alt="" />
            <span className="font-semibold text-sm content-center">Username</span>
        </div>
        <div className="pt-1 text-sm font">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
    </div>
}
export default CommentComponent;