import { useContext, useState } from 'react';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import profile_picture from '../../../assets/profile_picture.png';
import { get } from '../../../helper/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext';

interface EditProfileProps {
  username: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
}

const EditProfile = (userData: EditProfileProps) => {

  const [userInfo, setUserInfo] = useState<EditProfileProps>(userData);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [image, setImage] = useState<string>(userInfo.profilePicture || profile_picture);
  const { user: storedUser } = useContext(AuthContext);
  
  const handleUpdate = () => {
    const base64String = image.split(',')[1];
    get('users/login', {
      username: storedUser?.username,
      password: password
    }).then((response) => {
      if (!response || !response.token) {
        console.error('Login failed:', response.data.error);
        return;
      }
      get('users/update', {
        username: storedUser?.username,
        name: userInfo.name,
        email: userInfo.email,
        bio: userInfo.bio,
        profilePicture: base64String,
        newPassword: newPassword
      }).then((response) => {
        if (!response || !response.token) {
          console.error('Update failed:', response.data.error);
          return;
        }
        console.log('Update successful:', response);
      });
    });
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <ImageUpload defaultImage={image} onImageChange={(image) => setImage(image)} />
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
      <button onClick={() => handleUpdate()} className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg transition-all">
        Submit
      </button>
    </>
  );
};

export default EditProfile;
