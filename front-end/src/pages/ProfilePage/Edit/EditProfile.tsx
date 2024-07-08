import React, { useRef, useState } from 'react'

interface EditProfileProps {
  username: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
}

const EditProfile = (userData: EditProfileProps) => {
  const imagePreview = useRef<HTMLImageElement>(null)
  const imageUpload = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState('')

  const fileSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedFileTypes = ["image/jpeg", "image/png"];

      if (allowedFileTypes.includes(selectedFile.type)) {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (!event.target) return;
          const content = event.target.result; // This is an ArrayBuffer
          const arrayBufferToBase64 = (arrayBuffer) => {
            const binary = [];
            const bytes = new Uint8Array(arrayBuffer);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary.push(String.fromCharCode(bytes[i]));
            }
            return btoa(binary.join(""));
          };
          const base64String = arrayBufferToBase64(content);
          setImage(base64String);
          imagePreview.current?.setAttribute("src", `data:image/${selectedFile.name.split(".").pop()};base64,${base64String}`);
        };

        reader.readAsArrayBuffer(selectedFile);
      } else {
        e.target.value = "";
      }
    }
  };


  const [userInfo, setUserInfo] = useState<EditProfileProps>(userData);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <>
      <div className='flex mobile:flex-col laptop:flex-row items-center gap-6'>
        <div className="w-[100%] flex flex-col items-center">
          <img id="imagePreview" ref={imagePreview} onClick={() => { imageUpload && imageUpload.current?.click(); }} className="w-[60%] aspect-square object-contain rounded-lg cursor-pointer" src={userData.profilePicture} alt="Image Preview" />
          <input type="file" ref={imageUpload} onChange={(e) => { fileSelectHandler(e) }} id="imageUpload" className="hidden" accept="image/*" />
        </div>
        <div className='py-2 w-[100%] flex flex-col gap-5'>
          <div className="relative">
            <input autoComplete="off" required id="username" name="username" type="text" value={userInfo.username} onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })} className="bg-gray-100 bg-white peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Username" />
            <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
          </div>
          <div className="relative">
            <input autoComplete="off" required id="email" name="email" type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} className="bg-gray-100 bg-white peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="E-mail" />
            <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">E-mail</label>
          </div>
          <textarea
            className="w-[100%] border p-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={userInfo.bio}
            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
            rows={3}
            placeholder="Bio"></textarea>
          <div className="relative">
            <input autoComplete="off" required id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100 laptop:bg-white mt-2 laptop:mt-0 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
            <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-4 laptop:peer-placeholder-shown:top-2 transition-all peer-focus:-top-3 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
          </div>
          <div className="relative">
            <input autoComplete="off" required id="newPassword" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-gray-100 laptop:bg-white mt-2 laptop:mt-0 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="New Password" />
            <label htmlFor="newPassword" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-4 laptop:peer-placeholder-shown:top-2 transition-all peer-focus:-top-3 laptop:peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">New Password</label>
          </div>
        </div>
      </div>
      <button className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-lg transition-all">Submit</button>
    </>
  )
}

export default EditProfile