import { loadSlim } from '@tsparticles/slim'

export let isInitialized = false

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initializeParticleEngineSingleton = async (engine: any) => {
  if (!isInitialized) {
    await loadSlim(engine)
    isInitialized = true
  }
}
