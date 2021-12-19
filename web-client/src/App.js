import React, { useEffect, useRef, useState } from 'react'
import config from './config'

function App() {
  const [mediaStream, setMediaStream] = useState(null)
  const [mediaDeviceError, setMediaDeviceError] = useState(null)
  const [socketError, setSocketError] = useState(null)
  const [webSocket, setWebSocket] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const videoRef = useRef(null)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: { facingMode: 'environment' } })
      .then((response) => {
        setMediaStream(response)
      })
      .catch((err) => {
        setMediaDeviceError(err)
      })
  }, [])
  useEffect(() => {
    if (mediaStream) {
      videoRef.current.srcObject = mediaStream.clone()
    }
  }, [mediaStream])
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {mediaDeviceError && (
        <p style={{ color: 'red' }}>
          Media device error: {JSON.stringify(mediaDeviceError)}
        </p>
      )}
      {socketError && (
        <p style={{ color: 'red' }}>
          Websocket error: {JSON.stringify(socketError)}
        </p>
      )}
      {!webSocket ? (
        <button
          onClick={() => {
            if (mediaStream) {
              const socket = new WebSocket(config.webSocketUrlBase)
              const mediaRecorder = new MediaRecorder(mediaStream.clone(), {
                mimeType: 'video/webm',
              })
              socket.addEventListener('open', () => {
                mediaRecorder.ondataavailable = (ev) => {
                  socket.send(ev.data)
                }
                mediaRecorder.start(1000)
              })
              socket.addEventListener('error', (err) => {
                setSocketError(err)
              })
              socket.addEventListener('close', (ev) => {
                mediaRecorder.stop()
              })
              setWebSocket(socket)
              setMediaRecorder(mediaRecorder)
            }
          }}
        >
          Start streaming
        </button>
      ) : (
        <button
          onClick={() => {
            webSocket.close()
            setWebSocket(null)
          }}
        >
          Stop streaming
        </button>
      )}
      <video
        style={{ transform: 'scaleX(-1)' }}
        ref={videoRef}
        muted
        autoPlay
      ></video>
    </div>
  )
}

export default App
