import React from 'react'
import { usePage } from '@inertiajs/react'

const ConversationItem = ({ conversation, seletedConversation = null, online = null }) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = 'border-transparent';

    if(seletedConversation){
        if(
            !seletedConversation.is_group &&
            !conversation.is_group &&
            seletedConversation.id == conversation.id
        ) {
            
        }
    }
  return (
    <div>ConversationItem</div>
  )
}

export default ConversationItem