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

            return;
        }

        setRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            const newMediaRecorder = new MediaRecorder(stream);

            const chunk = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunk.push(event.data);
            })

            newMediaRecorder.addEventListener("stop", (event) => {
                let audioBlob = new Blob(chunk, {
                    type: 'audio/ogg; codecs=opus',
                })

                let audioFile = new File([audioBlob], "recorded_audio.ogg", {
                    type: 'audio/ogg; codecs=opus',
                })

                const url = URL.createObjectURL(audioFile);

                fileReady(audioFile, url)
            })

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder)
        } catch (error) {
            setRecording(false)
            console.error("Lỗi ở chức năng ghi âm: ", error);
        }
    }

    return (
        <button
            onClick={onMicrophoneClick}
            className='text-gray-400 hover:text-gray-200 p-1'
        >
            {recording ? <StopCircleIcon className='w-6 text-red-600' /> : <MicrophoneIcon className='w-6' />}
        </button>
    )
}

export default AudioRecorder