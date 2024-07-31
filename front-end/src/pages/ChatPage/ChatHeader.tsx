import { IoMdArrowBack } from "react-icons/io";
import profile_picture from '../../assets/profile_picture.png'

interface IChatHeaderProps {
    name: string;
    profilePicture: string;
    onBackClick?: () => void;
}

const ChatHeader = (data: IChatHeaderProps) => {
    return (
        <div className='h-[7%] bg-gray-700 text-white shadow-2xl flex flex-row items-center justify-between laptop:px-5'>
            <div className='h-[100%] flex flex-row items-center gap-2'>
                <div className='laptop:hidden h-full aspect-square flex items-center justify-center' onClick={() => {
                    if (data.onBackClick) data.onBackClick()
                }} >
                    <IoMdArrowBack size={24} />
                </div>
                <img src={data.profilePicture || profile_picture} alt="" className='h-[60%] mobile:hidden tablet:hidden' />
                <span className='text-lg font-semibold mobile:text-xl'>{data.name}</span>
            </div>
        </div>
    )
}

export default ChatHeader