"use client"

import { useState, useRef } from "react";

export default function VoiceRecorder({ onSend } : { onSend: (blob: Blob ) => void}) {

    const [ recording, setRecording ] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null >(null)
    const chunks = useRef<Blob[]>([])

    const startRecording = async () =>{
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunks.current = []

        mediaRecorder.ondataavailable = (e) =>{
            if(e.data.size > 0) chunks.current.push(e.data)
        }

        mediaRecorder.onstop = () =>{
            const audioBlob = new Blob(chunks.current, { type: "audio/webm" })
            onSend(audioBlob)
        }

        mediaRecorder.start()
        setRecording(true)
    }

    const stopRecording = () =>{
        mediaRecorderRef.current?.stop()
        setRecording(false)
    }

    return(
        <div>
            {!recording? (
                <button onClick={startRecording} className="p-2 bg-blue-500 rounded">
                    🎤
                </button>
            ):(
                <button onClick={stopRecording} className="p-2 bg-red-500 rounded">
                    ⏹ 
                </button>
            )}
        </div>
    )
}