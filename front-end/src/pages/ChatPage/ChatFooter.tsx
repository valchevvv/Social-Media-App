import { VscSend } from 'react-icons/vsc';

const ChatFooter = ({
  message,
  setMessage,
  sendMessage,
}: {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}) => {
  return (
    <>
      <div className="mobile:hidden tablet:hidden laptop:flex bg-gray-700 border-t-2 border-white border-opacity-10 z-50 shadow-2xl w-full h-[60px] text-white flex-row justify-center">
        <input
          type="text"
          className="w-full bg-transparent outline-none px-5 border-r-2"
          placeholder="Enter message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button className="px-3" onClick={sendMessage}>
          <VscSend size={24} />
        </button>
      </div>
      <div className="bg-gray-800 z-50 shadow laptop:hidden fixed bottom-5 left-[50%] p-2 translate-x-[-50%] w-[90%] h-[60px] text-white flex flex-row rounded-full backdrop-blur bg-opacity-60">
        <input
          type="text"
          className="w-full bg-transparent outline-none px-5 border-r-2"
          placeholder="Enter message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button className="px-3" onClick={sendMessage}>
          <VscSend size={24} />
        </button>
      </div>
    </>
  );
};

export default ChatFooter;
