import { useContext, useState } from 'react';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import profile_picture from '../../../assets/profile_picture.png';
import { post } from '../../../helper/axiosHelper';
import { AuthContext } from '../../../contexts/AuthContext';
import TextInput from '../../../components/TextInput';
import { useModal } from '../../../contexts/ModalContext';
import { notifySuccess } from '../../../helper/notificationHelper';

interface EditProfileProps {
  username: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
}

const EditProfile = (userData: EditProfileProps) => {

  const [userInfo, setUserInfo] = useState<EditProfileProps>(userData);
  const [newPassword, setNewPassword] = useState('');
  const [image, setImage] = useState<string>(userInfo.profilePicture || profile_picture);

  const { hideAllModals } = useModal();
  const { login } = useContext(AuthContext);

  const handleUpdate = () => {
    const base64String = image.split(',')[1];
    post('users/update', {
      username: userInfo.username,
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
      notifySuccess("Profile updated successfully!")
      hideAllModals();
      login(response.token);
      window.location.reload();
    });
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <ImageUpload defaultImage={image} onImageChange={(image) => setImage(image)} />
        <div className="py-2 w-full flex flex-col gap-5">
          <TextInput 
            name="name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            placeHolder="Name"
          />
          <TextInput 
            name="username"
            value={userInfo.username}
            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
            placeHolder="Username"
          />
          <TextInput
            name="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            placeHolder="E-mail"
          />
          <textarea
            className="w-full border p-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={userInfo.bio}
            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
            rows={3}
            placeholder="Bio"
          ></textarea>
          <TextInput
            name="newPassword"
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeHolder="New Password"
          />
        </div>
      </div>
      <button onClick={() => handleUpdate()} className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg transition-all">
        Submit
      </button>
    </>
  );
};

export default EditProfile;
