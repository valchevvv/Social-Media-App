import { useRef, useState } from 'react';

import { useLoadingSpinner } from '../../contexts/LoadingSpinnerContext';
import { post } from '../../helper/axiosHelper';
import { notifySuccess } from '../../helper/notificationHelper';
import { useNavigate } from 'react-router-dom';

const PostPage = () => {
  const { startLoading, stopLoading } = useLoadingSpinner();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

  const imagePreview = useRef<HTMLImageElement>(null);
  const imageUpload = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    startLoading();
    await post('post', {
      content: message,
      image: image,
    }).then(() => {
      stopLoading();
      navigate('/');
      notifySuccess('You successfully uploaded a post!');
    });
  };

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedFileTypes = ['image/jpeg', 'image/png'];

      if (allowedFileTypes.includes(selectedFile.type)) {
        const reader = new FileReader();

        reader.onload = event => {
          if (!event.target) return;
          const content = event.target.result as ArrayBuffer; // Type assertion to ensure content is of type ArrayBuffer
          const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
            const binary = [];
            const bytes = new Uint8Array(arrayBuffer);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary.push(String.fromCharCode(bytes[i]));
            }
            return btoa(binary.join(''));
          };
          const base64String = arrayBufferToBase64(content);
          setImage(base64String);
          imagePreview.current?.setAttribute(
            'src',
            `data:image/${selectedFile.name.split('.').pop()};base64,${base64String}`,
          );
        };

        reader.readAsArrayBuffer(selectedFile);
      } else {
        e.target.value = '';
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen tablet:w-96 mobile:w-[100%] gap-5 mobile:p-16">
        <div className="w-[100%] flex flex-col items-center">
          <div className="mb-4 w-full">
            <img
              id="imagePreview"
              ref={imagePreview}
              onClick={() => {
                imageUpload && imageUpload.current?.click();
              }}
              className="w-full object-cover rounded-lg cursor-pointer"
              src="https://via.placeholder.com/150"
              alt="Image Preview"
            />
          </div>
          <input
            type="file"
            ref={imageUpload}
            onChange={e => {
              fileSelectHandler(e);
            }}
            id="imageUpload"
            className="hidden"
            accept="image/*"
          />
        </div>
        <textarea
          className="w-[100%] border p-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          placeholder="Message"
        ></textarea>
        <button
          onClick={() => handlePost()}
          className="w-[100%] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition-all"
        >
          Post
        </button>
      </div>
    </>
  );
};

export default PostPage;
