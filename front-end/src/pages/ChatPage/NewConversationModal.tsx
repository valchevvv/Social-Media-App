import React, { useContext, useEffect, useState } from 'react'
import { ISimpleUser } from './ChatPage';
import { get } from '../../helper/axiosHelper';

import profile_picture from '../../assets/profile_picture.png'
import { useModal } from '../../contexts/ModalContext';
import { useSocketIoHelper } from '../../hooks/useSocket';
import { AuthContext } from '../../contexts/AuthContext';

const NewConversationModal = () => {

    const [contacts, setContacts] = useState<ISimpleUser[]>([]);

    const { hideAllModals } = useModal();
    const { user } = useContext(AuthContext);
    const { socket } = useSocketIoHelper();

    useEffect(() => {
        get('/users/contacts').then((res) => {
            setContacts(res);
        });
    }, [])

    const startNewConversation = (contact: ISimpleUser) => {
        if(!user || !contact || !socket) return;
        hideAllModals();
        socket.emit('new_conversation_b', {
            userId: user._id,
            contactId: contact._id
        });
    }

    return (
        <div className='flex flex-col max-h-96 overflow-y-auto'>
        {
            contacts.map((contact) => (
                <div key={contact._id} className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-3 items-center'>
                        <img src={contact.profilePicture || profile_picture} alt="" className='h-12 aspect-square rounded-full' />
                        <span className='font-semibold'>{contact.name}</span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-lg text-sm" onClick={() => startNewConversation(contact)}>
                        Message
                    </button>
                </div>
            ))
        }
        </div>
    )
}

export default NewConversationModal