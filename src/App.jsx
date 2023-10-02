import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const App = () => {
  const containerRef = useRef(null)
  const modelReady = useRef(false)
  const mixer = useRef(null)
  const clock = new THREE.Clock()
  let scene

  const moveModel = (buttonText, position) => {
    if (modelReady.current && scene) {
      const object = scene.getObjectByName('Walking.fbx')
      object.position.set(position.x, position.y, position.z)

      document.getElementById(
        'explanation'
      ).textContent = `Clicked "${buttonText}" - Moved model to X:${position.x}, Y:${position.y}, Z:${position.z}`
    }
  }

  scene = new THREE.Scene()

  useEffect(() => {
    let camera, renderer, controls

    const init = () => {
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

      // Load the FBX model
      const loader = new FBXLoader()
      loader.load('/assis-walk.fbx', object => {
        // Scale and position the model
        object.scale.set(0.01, 0.01, 0.01)
        object.position.set(0, 0, 0)

        // Start the default animation
        mixer.current = new THREE.AnimationMixer(object)
        const action = mixer.current.clipAction(object.animations[0])
        action.play()

        // Add it to the scene
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

    // Clean up the scene and controls when unmounting the component
    return () => {
      // Dispose of controls
      if (controls) {
        controls.dispose()
      }

      // Remove objects from the scene and dispose of their resources
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          // Dispose of the mesh's geometry and material
          obj.geometry.dispose()
          obj.material.dispose()
        }
      })

      // Clear the scene
      scene.clear()

      // Dispose of the renderer
      renderer.dispose()
    }
  }, [])

  return (
    <div>
      <div className='flex gap-3 space-y-2'>
        <button
          className='btn px-2 py-2 bg-blue-600 text-white rounded-full'
          onClick={() => moveModel('Button 1', { x: 0, y: 0, z: 0 })}
        >
          Button 1
        </button>
        <button
          className='btn px-2 py-2 bg-blue-600 text-white rounded-full'
          onClick={() => moveModel('Button 2', { x: 2, y: 0, z: 0 })}
        >
          Button 2
        </button>
        <button
          className='btn px-2 py-2 bg-blue-600 text-white rounded-full'
          onClick={() => moveModel('Button 3', { x: -2, y: 0, z: 0 })}
        >
          Button 3
        </button>
        <button
          className='btn px-2 py-2 bg-blue-600 text-white rounded-full'
          onClick={() => moveModel('Button 4', { x: 0, y: 0, z: -2 })}
        >
          Button 4
        </button>
        <button
          className='btn px-2 py-2 bg-blue-600 text-white rounded-full'
          onClick={() => moveModel('Button 5', { x: 0, y: 0, z: 2 })}
        >
          Button 5
        </button>
        <button
          className='btn px-2 py-2 bg-blue-600 text-white rounded-full'
          onClick={() => moveModel('Button 6', { x: 0, y: 2, z: 0 })}
        >
          Button 6
        </button>
      </div>
      <div id='explanation' className='mt-4 text-center text-gray-600'></div>
      <div ref={containerRef} />
    </div>
  )
}

export default App
