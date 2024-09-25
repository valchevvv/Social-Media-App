import profile_picture from '../../assets/profile_picture.png';
import { formatDate } from '../../helper/functions';
import { IMessage } from './ChatContent';
import { Link } from 'react-router-dom';

interface MessageComponentProps {
  message: IMessage;
  isMine: (message: IMessage) => boolean;
  isLastFromUser: boolean;
}

const MessageComponent = (data: MessageComponentProps) => {
  return (
    <div className={`flex flex-row ${data.isMine(data.message) ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col w-fit p-2 rounded-lg`}>
        <div className="flex flex-row items-end gap-2">
          {!data.isMine(data.message) && (
            <Link to={`/profile/${data.message.sender.username}`}>
              <img
                src={data.message.sender.profilePicture || profile_picture}
                alt=""
                className="h-6 rounded-full"
              />
            </Link>
          )}
          <span
            className={`font-semibold text-white p-2 rounded-lg ${data.isMine(data.message) ? 'bg-gray-500' : 'bg-blue-500'}`}
          >
            {data.message.content}
          </span>
        </div>
        {!data.isMine(data.message) && data.isLastFromUser && (
          <span className="w-full flex justify-end pt-1 text-gray-300 font-semibold text-xs">
            {formatDate(data.message.date.toString(), true)}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
