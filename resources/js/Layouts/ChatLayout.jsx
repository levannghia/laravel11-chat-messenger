import { usePage } from '@inertiajs/react'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import TextInput from '@/Components/TextInput';
import ConversationItem from '@/Components/App/ConversationItem';
import { useEventBus } from '@/EventBus';
import GroupModal from '@/Components/App/GroupModal';

const ChatLayout = ({ children }) => {
    const page = usePage();
    const { on } = useEventBus()
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [onlineUser, setOnlineUser] = useState({})
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false)

    // console.log('conversations', conversations);
    // console.log('selectedConversation', selectedConversation);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations])

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.block_at && b.block_at) {
                    return a.block_at > b.block_at ? 1 : -1;
                } else if (a.block_at) {
                    return 1;
                } else if (b.block_at) {
                    return -1;
                }

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations])

    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                console.log('here', users);
                const userOnlinesObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUser((prevOnlineUser) => {
                    return { ...prevOnlineUser, ...userOnlinesObj }
                });
            })
            .joining((user) => {
                console.log('joining', user);
                setOnlineUser((preOnlineUser) => {
                    const updateUsers = { ...preOnlineUser };
                    updateUsers[user.id] = user;
                    return updateUsers;
                })
            })
            .leaving((user) => {
                console.log('leaving', user);
                setOnlineUser((preOnlineUser) => {
                    const updateUsers = { ...preOnlineUser };
                    delete updateUsers[user.id];
                    return updateUsers;
                })
            })
            .error((error) => {
                console.error("error", error);
            })

        return () => {
            Echo.leave('online')
        }
    }, [])

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);

        return () => {
            offCreated();
            offDeleted();
        }
    }, [on]);

    const isOnlineUser = (userId) => onlineUser[userId];

    const onSearch = (val) => {
        const search = val.target.value.toLowerCase();

        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search)
                    //|| conversation.email.toLowerCase().includes(search)
                );
            })
        )
    }

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                if(message.receiver_id && !u.is_group && (u.id == message.sender_id || u.id == message.receiver_id)){
                    u.last_message_date = message.created_at;
                    u.last_message = message.message;

                    return u;
                }

                if(message.is_group && u.is_group && u.id == message.group_id) {
                    u.last_message_date = message.created_at;
                    u.last_message = message.message;

                    return u;
                }

                return u;
            })
        })
    }

    const messageDeleted = ({prevMessage}) => {
        if(!prevMessage){
            return;
        }

        console.log(prevMessage);
        messageCreated(prevMessage);
    }

    return (
        <>
            <div className='flex-1 w-full flex overflow-hidden'>
                <div className={
                    `transition-all w-full sm:w-[220px] md:w-[300px] dark:bg-slate-800 flex flex-col overflow-hidden
                    ${selectedConversation ? '-ml-[100%] sm:ml-0' : ''} 
                    `}
                >
                    <div
                        className='flex items-center justify-between py-2 px-3 text-xl font-medium text-gray-200'
                    >
                        My Conversation
                        <div className='tooltip tooltip-left'
                            data-tip="Create new group"
                        >
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className='text-gray-400 hover:text-gray-200'
                            >
                                <PencilSquareIcon className='w-4 h-4 inline-block ml-2' />
                            </button>
                        </div>
                    </div>
                    <div className='p-3'>
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users or groups"
                            className='w-full'
                        />
                    </div>
                    <div className='flex-1 overflow-auto'>
                        {sortedConversations && sortedConversations.map(conversation => (
                            <ConversationItem
                                key={`${conversation.is_group ? 'group_' : 'user_'}${conversation.id}`}
                                conversation={conversation}
                                online={!!isOnlineUser(conversation.id)}
                                seletedConversation={selectedConversation}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex-1 flex flex-col overflow-hidden'>
                    {children}
                </div>
            </div>
            <GroupModal show={showGroupModal} onClose={() => setShowGroupModal(false)}/>
        </>
    )
}

export default ChatLayout
