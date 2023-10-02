import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const ThreeModel = () => {
  const containerRef = useRef(null)
  const modelReady = useRef(false)
  const mixer = useRef(null)
  const clock = new THREE.Clock()

  useEffect(() => {
    let scene, camera, renderer, controls

    const init = () => {
      scene = new THREE.Scene()
      scene.add(new THREE.AxesHelper(5))

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.set(0.8, 1.4, 1.0)

      renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      containerRef.current.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.target.set(0, 1, 0)

      const loader = new FBXLoader()
      loader.load('../../public/assis-walk.fbx', object => {
        // Scale and position the model
        object.scale.set(0.01, 0.01, 0.01)
        object.position.set(0, 0, 0)

        mixer.current = new THREE.AnimationMixer(object)
        const action = mixer.current.clipAction(object.animations[0])
        action.play()

        scene.add(object)

        modelReady.current = true
      })

      animate()
    }

    const animate = () => {
      requestAnimationFrame(animate)

      if (modelReady.current) {
        mixer.current.update(clock.getDelta())
      }

      renderer.render(scene, camera)
    }

    init()

    return () => {
      scene.dispose()
      controls.dispose()
    }
  }, [])

  return <div ref={containerRef} />
}

export default ThreeModel
