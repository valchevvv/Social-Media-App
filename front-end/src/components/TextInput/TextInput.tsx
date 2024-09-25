import React from 'react';

const TextInput = ({
  name,
  value,
  onChange,
  placeHolder,
  type,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder: string;
  type?: string;
}) => {
  return (
    <div className="relative">
      <input
        autoComplete="off"
        required
        id={name}
        name={name}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        className="bg-gray-100 bg-white peer placeholder-transparent h-10 w-full border-b-2 p-3 rounded-lg border-gray-300 text-gray-900 focus:outline-none"
        placeholder={placeHolder}
      />
      <label
        htmlFor={name}
        className="absolute left-2 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {placeHolder}
      </label>
    </div>
  );
};

export default TextInput;
