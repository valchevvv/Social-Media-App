import React, { useRef, useState } from 'react';

import AvatarEditor from 'react-avatar-editor';

const ImageUpload = ({
  defaultImage,
  onImageChange,
}: {
  defaultImage: string;
  onImageChange: (image: string) => void;
}) => {
  const [image, setImage] = useState<string | null>(defaultImage);
  const [scale, setScale] = useState(1);

  const editor = useRef<AvatarEditor>(null);
  const imageUpload = useRef<HTMLInputElement>(null);

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
      onImageChange(canvas);
    }
  };

  return (
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
        <button
          onClick={() => imageUpload.current?.click()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          Upload Image
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          Save
        </button>
      </div>
      <input
        type="range"
        min="1"
        max="2"
        step="0.01"
        value={scale}
        onChange={e => setScale(parseFloat(e.target.value))}
        className="mt-2 w-full"
      />
    </div>
  );
};

export default ImageUpload;
