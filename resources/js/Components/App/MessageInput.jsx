import React, { useState } from 'react'
import { FaceFrownIcon, FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon } from '@heroicons/react/24/solid'
import NewMessageInput from './NewMessageInput';
import axios from 'axios';

const MessageInput = ({ conversation = null }) => {
  const [newNewMessage, setNewMessgae] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);

  const onSend = () => {
    if(messageSending){
      return;
    }
    
    if (newNewMessage.trim() === "") {
      setInputErrorMessage("Please provide a message or upload attachments. ");
      setTimeout(() => {
        setInputErrorMessage("");
      }, 3000)

      return;
    }

    const formData = new FormData();
    formData.append('message', newNewMessage);
    if (conversation.is_user) {
      formData.append('receiver_id', conversation.id);
    } else if (conversation.is_group) {
      formData.append('group_id', conversation.id);
    }

    setMessageSending(true);

    axios.post(route('message.store'), formData, {
      onUploadProgress: (progessEvent) => {
        const progess = Math.round(
          (progessEvent.loaded / progessEvent.total) * 100
        );

        console.log(progess);
      }
    }).then((response) => {
      setNewMessgae("");
      setMessageSending(false);
    }).catch((error) => {
      setMessageSending(false);
      setInputErrorMessage(error)
    })
  }

  return (
    <div className='flex flex-wrap items-start border-t border-slate-700 py-3'>
      <div className='order-2 flex-1 xs:flex-none xs:order-1 p-2'>
        <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
          <PaperClipIcon className='w-6' />
          <input type='file' multiple className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer' />
        </button>
        <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
          <PhotoIcon className='w-6' />
          <input type='file' accept='image/*' multiple className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer' />
        </button>
      </div>
      <div className='order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative'>
        <div className="flex">
          <NewMessageInput
            onSend={onSend}
            value={newNewMessage}
            onChange={(val) => setNewMessgae(val.target.value)}
          />
          <button
            onClick={onSend}
            disabled={messageSending}
            className='btn btn-info rounded-l-none'
          >
            {messageSending && (
              <span className='loading loading-spinner loading-xs'></span>
            )}
            <PaperAirplaneIcon className='w-6' />
            <span className='hidden sm:inline'>Send</span>
          </button>
        </div>
        {inputErrorMessage && (
          <p className='text-xs text-red-400'>{inputErrorMessage}</p>
        )}
      </div>
      <div className='order-3 xs:order-3 p-2 flex'>
        <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
          <FaceSmileIcon className="w-6 h-6" />
        </button>
        <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
          <HandThumbUpIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default MessageInput