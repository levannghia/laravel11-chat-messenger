import React, { useRef, useEffect }  from 'react'

const NewMessageInput = ({value, onChange, onSend}) => {
    const inputRef = useRef()

    useEffect(() => {
        adjustHeight()
    }, [value])

    const onInputKeyDown = (ev) => {
        if(ev.key === 'enter' && !ev.shiftKey){
            ev.preventDefault();
            onSend();
        }
    }

    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);

        onChange(ev)
    }

    const adjustHeight = () => {
        setTimeout(() => {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + 1 + "px"
        }, 100)
    }

    
  return (
    <textarea
        value={value}
        rows={1}
        ref={inputRef}
        placeholder='Type a message'
        onKeyDown={onInputKeyDown}
        onChange={(val) => onChangeEvent(val)}
        className='input input-bordered w-full rounded-r-none resize-none overflow-y-auto max-h-40'
    >
    </textarea>
  )
}

export default NewMessageInput