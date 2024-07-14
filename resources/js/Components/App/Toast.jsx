import { useEventBus } from '@/EventBus'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const Toast = () => {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on('toast.show', (message) => {
            const uuid = uuidv4();

            setToasts((oldToast) => [...oldToast, {message, uuid}]);

            setTimeout(() => {
                setToasts((oldToast) => oldToast.filter((toast) => toast.uuid !== uuid))
            }, 4000)
        })
    }, [on])
    return (
        <div className="toast min-w-[280px] w-full xs:w-auto">
            {toasts.map((toast, index) => (
                <div key={toast.uuid} className="alert alert-success py-3 px-4 text-gray-100 rounded-md">
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    )
}

export default Toast