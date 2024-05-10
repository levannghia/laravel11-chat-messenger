import { usePage } from '@inertiajs/react'
// import Echo from 'laravel-echo';
import React, { useEffect } from 'react'

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    console.log('conversations', conversations);
    console.log('selectedConversation', selectedConversation);
    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                console.log('here', users);
            })
            .joining((users) => {
                console.log('joining', users);
            })
            .leaving((users) => {
                console.log('leaving', users);
            })
            .error((error) => {
                console.error("error", error);
            })
    }, [])

    return (
        <>
            Chat Layout
            {children}
        </>
    )
}

export default ChatLayout
