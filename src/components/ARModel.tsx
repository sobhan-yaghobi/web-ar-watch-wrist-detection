import * as tf from "@tensorflow/tfjs"
import  handPose from "@tensorflow-models/handpose"
import Webcam from "react-webcam"
import { useEffect, useRef } from "react"

const ARModel = () => {
  const webcamRef = useRef<Webcam | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const runHandPose = async () => {
    const net = await handPose.load()

    setInterval(() => {
    //   detect(net)
      console.log("HHHHH", net)
    }, 100)
  }

//   const detect = async (net: handpose.HandPose) => {
//     if (webcamRef.current && webcamRef.current?.video?.readyState) {
//       const video = webcamRef.current.video
//       const videoWidth = webcamRef.current.video.videoWidth
//       const videoHeight = webcamRef.current.video.videoHeight

//       webcamRef.current.video.width = videoWidth
//       webcamRef.current.video.height = videoHeight

//       const hand = await net.estimateHands(video)
//       console.log("hand", hand)
//     }
//   }

  runHandPose()

  return (
    <div>
      <Webcam ref={webcamRef}></Webcam>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default ARModel
