import React, { useEffect, useRef, useState } from 'react'
import Dexie from 'dexie'
import config from './config'
import {
  PauseButton,
  RecordButton,
  StopButton,
  Button,
} from './components/particles/Buttons'

const db = new Dexie('Voir')
db.version(1).stores({
  videoBlobs: '++id, i, videoIdentifier',
})

const useVoir = () => {
  const [mediaStream, setMediaStream] = useState(null)
  const [mediaDeviceError, setMediaDeviceError] = useState(null)
  const [socketError, setSocketError] = useState(null)
  const [webSocket, setWebSocket] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [mediaRecorderState, setMediaRecorderState] = useState({
    started: false,
    recording: false,
    videoIdentifier: 'none',
  })
  const [indexDBVideos, setIndexDBVideos] = useState([])
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
    db.videoBlobs
      .orderBy('videoIdentifier')
      .uniqueKeys()
      .then((list) => setIndexDBVideos(list))
      .catch((err) => console.log(err))
  }, [])
  const start = () => {
    if (mediaStream) {
      const videoIdentifier = new Date().toJSON()
      const socket = new WebSocket(config.webSocketUrlBase)
      const mediaRecorder = new MediaRecorder(mediaStream.clone(), {
        mimeType: 'video/webm',
      })
      mediaRecorder.addEventListener('pause', () => {
        setMediaRecorderState({
          started: true,
          recording: false,
          videoIdentifier,
        })
      })
      mediaRecorder.addEventListener('start', () => {
        setMediaRecorderState({
          started: true,
          recording: true,
          videoIdentifier,
        })
      })
      mediaRecorder.addEventListener('resume', () => {
        setMediaRecorderState({
          started: true,
          recording: true,
          videoIdentifier,
        })
      })
      mediaRecorder.addEventListener('stop', () => {
        setMediaRecorderState({
          started: false,
          recording: false,
          videoIdentifier,
        })
      })
      socket.addEventListener('open', () => {
        mediaRecorder.ondataavailable = (ev) => {
          socket.send(ev.data)
        }
        mediaRecorder.start(1000)
      })
      socket.addEventListener('error', (err) => {
        setSocketError(err)
        setWebSocket(null)
        let i = 0
        mediaRecorder.ondataavailable = (ev) => {
          db.videoBlobs.add({
            videoIdentifier,
            blob: ev.data,
            i,
          })
          i++
        }
        mediaRecorder.start(1000)
      })
      socket.addEventListener('close', (ev) => {})
      setWebSocket(socket)
      setMediaRecorder(mediaRecorder)
    }
  }
  return {
    mediaDeviceError,
    socketError,
    mediaRecorder,
    mediaRecorderState,
    indexDBVideos,
    mediaStream,
    start,
  }
}

function App() {
  const {
    mediaDeviceError,
    socketError,
    mediaRecorder,
    mediaRecorderState,
    indexDBVideos,
    mediaStream,
    start,
  } = useVoir()
  const videoRef = useRef(null)
  useEffect(() => {
    if (mediaStream) {
      videoRef.current.srcObject = mediaStream.clone()
    }
  }, [mediaStream])
  return (
    <div className="flex flex-col">
      {mediaStream && (
        <p className="text-white">
          {JSON.stringify(
            mediaStream.getVideoTracks()[0].getSettings(),
            null,
            2
          )}
        </p>
      )}
      {mediaDeviceError && (
        <p>Media device error: {mediaDeviceError.message}</p>
      )}
      {socketError && (
        <p style={{ color: 'red' }}>
          Websocket error: {JSON.stringify(socketError)}
        </p>
      )}
      <ol className="fixed z-10">
        {indexDBVideos.map((videoIdentifier) => (
          <li className="text-white" key={videoIdentifier}>
            {videoIdentifier}{' '}
            <Button
              onClick={() => {
                db.videoBlobs
                  .where('videoIdentifier')
                  .equals(videoIdentifier)
                  .toArray()
                  .then((array) => {
                    const sortedChunks = array
                      .sort((a, b) => a.i - b.i)
                      .map((items) => items.blob)
                    const video = new Blob(sortedChunks, {
                      type: 'video/webm',
                    })
                    var videoURL = URL.createObjectURL(video)
                    videoRef.current.srcObject = null
                    videoRef.current.src = videoURL
                  })
              }}
            >
              Play video
            </Button>
          </li>
        ))}
      </ol>
      <div className="fixed z-10 m-auto left-0 right-0 flex justify-center w-fit bottom-5 bg-white rounded-full p-4">
        {mediaRecorderState.started && !mediaRecorderState.recording && (
          <RecordButton
            onClick={() => {
              mediaRecorder.resume()
            }}
          />
        )}
        {!mediaRecorderState.started && <RecordButton onClick={start} />}
        {mediaRecorderState.recording && (
          <PauseButton
            onClick={() => {
              mediaRecorder.pause()
            }}
          />
        )}
        {mediaRecorderState.started && (
          <StopButton
            onClick={() => {
              mediaRecorder.stop()
            }}
          />
        )}
      </div>
      <video
        className="max-w-full max-h-screen"
        style={{
          transform:
            mediaStream &&
            mediaStream.getVideoTracks()[0].getSettings().facingMode ===
              'environment'
              ? ''
              : 'scaleX(-1)',
        }}
        ref={videoRef}
        muted
        autoPlay
      ></video>
    </div>
  )
}

export default App
