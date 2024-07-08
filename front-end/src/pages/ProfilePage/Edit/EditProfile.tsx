import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

interface EditProfileProps {
  username: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
}

const EditProfile = (userData: EditProfileProps) => {
  const imageUpload = useRef<HTMLInputElement>(null);
  const editor = useRef<AvatarEditor>(null);

  const [image, setImage] = useState<string | null>(userData.profilePicture);
  const [scale, setScale] = useState(1);
  const [userInfo, setUserInfo] = useState<EditProfileProps>(userData);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedFileTypes = ['image/jpeg', 'image/png'];
      if (allowedFileTypes.includes(selectedFile.type)) {
        setImage(URL.createObjectURL(selectedFile));
      } else {
        e.target.value = '';
      }
    }
  };

  const handleSave = () => {
    if (editor.current) {
      const canvas = editor.current.getImageScaledToCanvas().toDataURL();
      setImage(canvas);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center">
          {image && (
            <AvatarEditor
              ref={editor}
              image={image}
              border={50}
              borderRadius={125}
              color={[255, 255, 255, 0.6]}
              scale={scale}
              rotate={0}
              className="avatar-editor"
            />
          )}
          <input
            type="file"
            ref={imageUpload}
            onChange={fileSelectHandler}
            className="hidden"
            accept="image/*"
          />
          <div className="flex mt-2 gap-2">
            <button onClick={() => imageUpload.current?.click()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
              Upload Image
            </button>
            <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
              Save
            </button>
          </div>
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
        <div className="py-2 w-full flex flex-col gap-5">
          <div className="relative">
            <input
              autoComplete="off"
              required
              id="username"
              name="username"
              type="text"
              value={userInfo.username}
              onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
              className="bg-gray-100 bg-white peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
              placeholder="Username"
            />
            <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
          </div>
          <div className="relative">
            <input
              autoComplete="off"
              required
              id="email"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="bg-gray-100 bg-white peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
              placeholder="E-mail"
            />
            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm">E-mail</label>
          </div>
          <textarea
            className="w-full border p-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={userInfo.bio}
            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
            rows={3}
            placeholder="Bio"
          ></textarea>
          <div className="relative">
            <input
              autoComplete="off"
              required
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 bg-white mt-2 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
              placeholder="Password"
            />
            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-4 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
          </div>
          <div className="relative">
            <input
              autoComplete="off"
              required
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-100 bg-white mt-2 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
              placeholder="New Password"
            />
            <label htmlFor="newPassword" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-4 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">New Password</label>
          </div>
        </div>
      </div>
      <button className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg transition-all">
        Submit
      </button>
    </>
  );
};

export default EditProfile;
