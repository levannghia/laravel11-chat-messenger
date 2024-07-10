import React from 'react'
import { usePage } from '@inertiajs/react'
import ReactMarkdown from 'react-markdown'
import UserAvatar from './UserAvatar'
import { formatMessageDateLong } from '@/helpers'
import MessageAttachments from './MessageAttachments'

const MessageItem = ({message, attachmentClick}) => {
    const currentUser = usePage().props.auth.user;
    // console.log(message);
  return (
    <div
        className={
            'chat ' + (
                message.sender_id === currentUser.id ? "chat-end" : 'chat-start'
            )
        }
    >
        <UserAvatar user={message.sender}/>
        <div className={'chat-header'}>
            {message.sender_id !== currentUser.id ? message.sender.name : ''}
            <time className="text-xs opacity-50 ml-2">{formatMessageDateLong(message.created_at)}</time>
        </div>
        <div
            className={'chat-bubble relative ' + (message.sender_id === currentUser.id ? 'chat-bubble-info' : '')}
        >
            <div className='chat-message'>
                <div className='chat-message-content'>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
                <MessageAttachments
                    attachmentClick={attachmentClick}
                    attachments={message.attachments}
                />
            </div>
        </div>
    </div>
  )
}

export default MessageItem