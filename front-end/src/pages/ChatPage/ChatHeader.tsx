import profile_picture from '../../assets/profile_picture.png';
import { IoMdArrowBack } from 'react-icons/io';

interface IChatHeaderProps {
  name: string;
  profilePicture: string;
  onBackClick?: () => void;
}

const ChatHeader = (data: IChatHeaderProps) => {
  return (
    <>
      <div className="mobile:hidden tablet:hidden laptop:flex h-[7%] bg-gray-700 text-white shadow-2xl flex-row items-center justify-between laptop:px-5">
        <div className="h-[100%] flex flex-row items-center gap-2">
          <div className="laptop:hidden h-full aspect-square flex items-center justify-center">
            <IoMdArrowBack size={24} />
          </div>
          <img src={data.profilePicture || profile_picture} alt="" className="h-[60%]" />
          <span className="text-lg font-semibold">{data.name}</span>
        </div>
      </div>
      <div className="bg-gray-800 z-50 shadow laptop:hidden fixed top-5 left-[50%] p-2 translate-x-[-50%] w-[90%] h-[60px] text-white flex flex-row rounded-full backdrop-blur bg-opacity-60">
        <div className="h-[100%] flex flex-row items-center gap-2">
          <div
            className="laptop:hidden h-full aspect-square flex items-center justify-center"
            onClick={() => {
              if (data.onBackClick) data.onBackClick();
            }}
          >
            <IoMdArrowBack size={24} />
          </div>
          <span className="font-semibold text-xl">{data.name}</span>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
