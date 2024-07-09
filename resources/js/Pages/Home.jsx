import Authenticated from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { useRef } from 'react';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import { useEventBus } from '@/EventBus';
import axios from 'axios';
import AttachmentPreviewModal from '@/Components/App/AttachmentPreviewModal';

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [showAttachmentPriview, setShowAttachmentPriview] = useState(false)
    const [perviewAttachment, setPerviewAttachment] = useState({})
    const messagesCtrRef = useRef(null)
    const loadMoreIntersectRef = useRef(null);
    const { on } = useEventBus()
    // console.log('message', messages);

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        }, 10)
      
        const offCreated = on('message.created', messageCreated);
        setScrollFromBottom(0);
        setNoMoreMessages(false);
        return () => {
            offCreated();
        }
    }, [selectedConversation])

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages])

    useEffect(() => {
        if(messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
             messagesCtrRef.current.scrollHeight - messagesCtrRef.current.offsetHeight - scrollFromBottom;

            //  console.log("scrollTop" ,messagesCtrRef.current.scrollTop);
        }

        if(noMoreMessages){
            return;
        }

        const observer = new IntersectionObserver((entries) => entries.forEach(
            (entry) => entry.isIntersecting && loadMoreMessages()
        ),{
            rootMargin: "0px 0px 250px 0px",
        })

        if(loadMoreIntersectRef.current){
            setTimeout(() => {
                observer.observe(loadMoreIntersectRef.current);
            }, 100);
        }

        return () => {
            observer.disconnect();
        }
    }, [localMessages])

    const messageCreated = (message) => {
        if(selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id) {
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }

        if(selectedConversation && selectedConversation.is_user && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)){
            setLocalMessages((prevMessage) => [...prevMessage, message]);
        }
    }

    const loadMoreMessages = useCallback(() => {
        if(noMoreMessages){
            return;
        }
        const firstMessage = localMessages[0];
        try {
            axios.get(route('message.loadOlder', firstMessage.id)).then(({data}) => {
                console.log(data);
                if(data.data.length === 0){
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
                // console.log("tmpScrollBottom ", tmpScrollFromBottom);
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);
                if(data.data){
                    setLocalMessages((prevMessage) => {
                        return [...data.data.reverse(), ...prevMessage];
                    })
                }
            });
           
        } catch (error) {
            console.error(error);
        }
    }, [localMessages, noMoreMessages])

    const onAttachmentClick = (attachments, ind) => {
        setPerviewAttachment({
            attachments,
            ind
        })

        setShowAttachmentPriview(true);
    }
    // console.log(messagesCtrRef.current.scrollHeight);
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
                                <div ref={loadMoreIntersectRef}></div>
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {perviewAttachment.attachments &&  (
                <AttachmentPreviewModal
                    attachments={perviewAttachment.attachments}
                    index={perviewAttachment.ind}
                    show={showAttachmentPriview}
                    onClose={() => setShowAttachmentPriview(false)}
                />
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
