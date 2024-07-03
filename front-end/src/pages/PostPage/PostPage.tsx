import { useRef, useState } from "react"
import { post } from "../../helper/axiosHelper"
import { useLoadingSpinner } from "../../contexts/LoadingSpinnerContext"
import { useNavigate } from "react-router-dom";

const PostPage = () => {
    const { startLoading, stopLoading } = useLoadingSpinner();
    const navigate = useNavigate();

    const [message, setMessage] = useState('')
    const [image, setImage] = useState('')
    
    const imagePreview = useRef<HTMLImageElement>(null)
    const imageUpload = useRef<HTMLInputElement>(null)
    


    const handlePost = async () => {
        startLoading();
        await post('post', {
            content: message,
            image: image
        }).then(() => {
            stopLoading();
            navigate('/')
        });
    }


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



    return (
        <>
            <div className="laptop:hidden flex flex-col items-center justify-center h-screen gap-5">
                <div className="w-[70%] flex flex-col items-center">
                    <div className="mb-4 w-full">
                        <img id="imagePreview" ref={imagePreview} onClick={() => { imageUpload && imageUpload.current?.click(); }} className="w-full object-cover rounded-lg cursor-pointer" src="https://via.placeholder.com/150" alt="Image Preview" />
                    </div>
                    <input type="file" ref={imageUpload} onChange={(e) => { fileSelectHandler(e) }} id="imageUpload" className="hidden" accept="image/*" />
                </div>
                <div className="w-[70%]">
                    <div className="relative w-full min-w-[200px]">
                        <textarea
                            className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder=" "></textarea>
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Message
                        </label>
                    </div>
                </div>
                <button onClick={() => handlePost()} className="w-[70%] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition-all">Post</button>
            </div>
            
        </>
    )
}

export default PostPage