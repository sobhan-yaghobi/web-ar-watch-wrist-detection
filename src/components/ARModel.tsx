import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Hands } from "@mediapipe/hands"
import "@mediapipe/hands"
import { GLTFLoader } from "three/examples/jsm/Addons.js"

const ARModel = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)

  const wristLandmarkIndex = 0

  const initializeAR = async () => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    })
    videoElement.srcObject = stream
    videoElement.play()

    const hands = new Hands()
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    })

    hands.onResults((results) => {
      if (results.multiHandLandmarks.length > 0) {
        const wrist = results.multiHandLandmarks[0][wristLandmarkIndex]
        placeWatchOnWrist(wrist)
      }
    })

    videoElement.addEventListener("play", () => {
      const detectHand = () => {
        hands.send({ image: videoElement })
        requestAnimationFrame(detectHand)
      }
      detectHand()
    })

    setupThreeJS()
  }

  const placeWatchOnWrist = (wrist) => {
    const wristPosition = new THREE.Vector3(
      wrist.x * 2 - 1,
      -(wrist.y * 2 - 1),
      -wrist.z
    )
    const camera = cameraRef.current
    const scene = sceneRef.current

    const watchPosition = wristPosition
    scene.children.forEach((child) => {
      if (child.type === "Group") {
        child.position.set(watchPosition.x, watchPosition.y, watchPosition.z)
      }
    })
  }

  const cleanUp = () => {
    if (videoRef.current) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
    }
  }

  const setupThreeJS = () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer
    cameraRef.current = camera
    sceneRef.current = scene

    const loader = new GLTFLoader()
    loader.load("/watch.glb", (gltf) => {
      const watchModel = gltf.scene
      watchModel.scale.set(0.1, 0.1, 0.1)
      scene.add(watchModel)
    })
    const light = new THREE.AmbientLight()
    scene.add(light)

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    animate()
  }

  useEffect(() => {
    initializeAR()

    return () => cleanUp()
  }, [])

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef}></canvas>
      <h1>Web Ar Watch Detection</h1>
    </div>
  )
}

export default ARModel
