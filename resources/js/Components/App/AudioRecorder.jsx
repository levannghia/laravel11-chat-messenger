import { MicrophoneIcon, StopCircleIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'

const AudioRecorder = ({fileReady}) => {
    const [mediaRecorder, setMediaRecorder] = useState(null)
    const [recording, setRecording] = useState(false);

    const onMicrophoneClick = async () => {
        if(recording) {
            setRecording(false);
            if(mediaRecorder){
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
        }
    }

    return (
        <button
            onClick={onMicrophoneClick}
            className='text-gray-400 hover:text-gray-200 p-1'
        >
            {recording ? <StopCircleIcon className='w-6' /> : <MicrophoneIcon className='w-6' />}
        </button>
    )
}

export default AudioRecorder