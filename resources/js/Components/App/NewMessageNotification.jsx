import { useEventBus } from '@/EventBus'
import { Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import UserAvatar from './UserAvatar';

const NewMessageNotification = () => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        const handleNewMessageNotification = ({ message, user, group_id }) => {
            const uuid = uuidv4();

            setToasts((oldToast) => [...oldToast, { message, uuid, user, group_id }]);

            setTimeout(() => {
                setToasts((oldToast) => oldToast.filter((toast) => toast.uuid !== uuid))
            }, 4000);

            notifyMe({message, user, group_id});
        }
        const offNotify = on('newMessageNotification', handleNewMessageNotification);

        return () => {
            offNotify();
        }

    }, [on])

    function notifyMe({message, user, group_id = null}) {
        if (!document.hidden) {
            console.log('User is on the page. No need to send notification.');
            return;
        }

        if (!window.Notification) {
            console.log('Browser does not support notifications.');
        } else {
            // kiểm tra quyền được gửi notification
            if (Notification.permission === 'granted') {
                // hiển thị thông báo khi đã cấp quyền
                var notify = new Notification(`Bạn nhận được tin nhắn từ ${user.name}`, {
                    body: message,
                    icon: user.avatar_url ? user.avatar_url : null,
                });

                notify.onclick = function () {
                    window.focus();
                    if (group_id) {
                        window.location.href = route('chat.group', group_id);
                    } else {
                        window.location.href = route('chat.user', user);
                    }
                };
            } else {
                // Kiểm tra quyền trước khi được gửi thông báo
                Notification.requestPermission().then(function (p) {
                    if (p === 'granted') {
                        // hiển thị thông báo
                        var notify = new Notification('Xin chào!', {
                            body: 'Bạn cần hỗ trợ gì?',
                            icon: 'https://agitech.com.vn/images/logo-agitech.png',
                        });
                    } else {
                        console.log('User blocked notifications.');
                    }
                }).catch(function (err) {
                    console.error(err);
                });
            }
        }
    }
    
    return (
        <div className="toast toast-top toast-center min-w-[280px]">
            {toasts.map((toast, index) => (
                <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
                    <Link
                        href={toast.group_id ? route('chat.group', toast.group_id) : route('chat.user', toast.user.id)}
                        className='flex items-center gap-2'
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default NewMessageNotification