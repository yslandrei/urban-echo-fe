import { DeviceMotion } from 'expo-sensors'
import { useEffect, useState } from 'react'

/**
 * Configuration options for the shake detection
 */
interface UseShakeOptions {
  /** Threshold for shake detection sensitivity (default: 800) */
  threshold?: number
  /** Minimum time (in ms) between shake detections (default: 1000) */
  debounceMs?: number
  /** Update interval for device motion (default: 100) */
  updateInterval?: number
  /** Number of movements required for shake detection (default: 2) */
  requiredMovements?: number
}

/**
 * A hook that detects device shake events using the device motion
 *
 * @param callback - Function to be called when a shake is detected
 * @param options - Configuration options for shake detection
 * @param options.threshold - Sensitivity threshold (lower = more sensitive)
 * @param options.debounceMs - Minimum time between shake detections
 * @param options.updateInterval - Update interval for device motion
 * @param options.requiredMovements - Number of movements required for shake
 *
 * @returns Whether the device is currently shaking
 */
function useShake(
  callback?: () => void,
  { threshold = 800, debounceMs = 1000, updateInterval = 100, requiredMovements = 2 }: UseShakeOptions = {}
) {
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    let movementCount = 0
    let lastDirection = 0
    let lastUpdate = 0
    let lastShake = 0
    let lastX = 0
    let lastY = 0
    let lastZ = 0

    const subscription = DeviceMotion.addListener((data) => {
      const { x, y, z } = data.accelerationIncludingGravity
      const currentTime = Date.now()

      if (currentTime - lastUpdate > updateInterval) {
        const diffTime = currentTime - lastUpdate
        const speed = (Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime) * 10000
        const direction = Math.sign(x + y + z - lastX - lastY - lastZ)

        if (speed > threshold) {
          if (direction !== lastDirection && currentTime - lastUpdate > 50) {
            movementCount++
            lastDirection = direction
          }

          if (movementCount >= requiredMovements && currentTime - lastShake > debounceMs) {
            lastShake = currentTime
            setIsShaking(true)
            setTimeout(() => (setIsShaking(false), (movementCount = 0)), 300)
            callback?.()
          }
        } else if (currentTime - lastUpdate > 300) {
          movementCount = 0
        }

        lastUpdate = currentTime
        lastX = x
        lastY = y
        lastZ = z
      }
    })

    DeviceMotion.setUpdateInterval(updateInterval)

    return () => subscription?.remove()
  }, [debounceMs, requiredMovements, threshold, updateInterval, callback])

  return isShaking
}

export { useShake }
