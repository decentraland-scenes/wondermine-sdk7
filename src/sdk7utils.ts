import { type ReadOnlyQuaternion, type Vector3 } from '~system/EngineApi'
import { type Quaternion } from '~system/RestrictedActions'

export function rotationAxisToRef(axis: Vector3, angle: number, result: Quaternion): Quaternion {
  const halfAngle = angle * 0.5
  const sinHalfAngle = Math.sin(halfAngle)

  result.x = axis.x * sinHalfAngle
  result.y = axis.y * sinHalfAngle
  result.z = axis.z * sinHalfAngle
  result.w = Math.cos(halfAngle)

  return result
}

export function multiplyInPlace(q1: ReadOnlyQuaternion, result: Quaternion): Quaternion {
  result.x *= q1.x
  result.y *= q1.y
  result.z *= q1.z
  result.w *= q1.w

  return result
}
