'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { type ISourceOptions, MoveDirection, OutMode } from '@tsparticles/engine'
import { initializeParticleEngineSingleton, isInitialized } from '@/lib/particle-engine-singleton'

const ParticlesComponent: React.FC = () => {
  const [init, setInit] = useState(isInitialized)
  const hasInitializedRef = useRef(false) // need this to prevent useEffect from running multiple times

  useEffect(() => {
    const initializeParticles = async () => {
      await initParticlesEngine((engine) => initializeParticleEngineSingleton(engine))
      setInit(isInitialized)
    }

    if (!hasInitializedRef.current) {
      if (!isInitialized) {
        initializeParticles()
      } else {
        setInit(true)
      }

      hasInitializedRef.current = true
    }
  }, [])

  const particlesLoaded = async (): Promise<void> => {
    return
  }

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse',
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 125,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#ced7e3',
        },
        links: {
          color: '#1f2937',
          distance: 250,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.bounce,
          },
          random: false,
          speed: 2,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            height: 1200,
            width: 1200,
          },
          value: 50,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 4 },
        },
      },
      detectRetina: true,
    }),
    []
  )

  if (init) {
    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />
  }

  return <></>
}

export { ParticlesComponent }
