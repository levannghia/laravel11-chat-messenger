import Authenticated from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { useRef } from 'react';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef()
    console.log('message', messages);
    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages])

    return (
        <>
            <Head title="Home" />
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to messages
                    </div>
                    <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader selectedConversation={selectedConversation} />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {localMessages.length === 0 && (
                            <div className='flex justify-center items-center h-full'>
                                <div className='text-lg text-slate-200'>
                                    No message found
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className='flex flex-col flex-1'>
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation}/>
                </>
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <Authenticated>
            <ChatLayout children={page} />
        </Authenticated>
    )
}

export default Home
