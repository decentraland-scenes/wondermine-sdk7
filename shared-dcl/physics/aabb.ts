import { Vector3 } from '@dcl/sdk/math'
import { type Rayo } from './ray'

/**
 * A simple Axis Aligned Bounding Box (AABB) class
 */
export class AABB {
  public halfSize: Vector3.MutableVector3
  public center: Vector3.MutableVector3
  public min: Vector3.ReadonlyVector3
  public max: Vector3.ReadonlyVector3

  // collisions
  public hitPoint: Vector3.ReadonlyVector3 | undefined
  public hitFaceNormal: Vector3.ReadonlyVector3 | undefined

  constructor(_center: Vector3.ReadonlyVector3, _fullSize: Vector3.MutableVector3) {
    this.center = Vector3.create(_center.x, _center.y, _center.z) // Crear copia mutable
    this.halfSize = Vector3.multiplyByFloats(_fullSize, 0.5, 0.5, 0.5) // ✅ Usar función estática

    const p1: Vector3.MutableVector3 = Vector3.add(this.center, this.halfSize)
    const p2: Vector3.MutableVector3 = Vector3.subtract(this.center, this.halfSize)

    this.min = Vector3.create(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.min(p1.z, p2.z))

    this.max = Vector3.create(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y), Math.max(p1.z, p2.z))
  }

  getClosestNormal(point: Vector3): Vector3 {
    // TODO: Handle cases where the point has passed all the way through and out the other side
    return this.getFaceNormal(this.getSurfacePoint(point))
  }

  isPointInside(point: Vector3): boolean {
    if (point.x < this.min.x || point.y < this.min.y || point.z < this.min.z) {
      return false
    }
    if (point.x > this.max.x || point.y > this.max.y || point.z > this.max.z) {
      return false
    }
    return true
  }

  /**
   * Returns the closest point on the box from a point outside it
   */
  clampPoint(point: Vector3.ReadonlyVector3): Vector3.MutableVector3 {
    const result = Vector3.create(point.x, point.y, point.z)

    result.x = Math.min(Math.max(result.x, this.min.x), this.max.x)
    result.y = Math.min(Math.max(result.y, this.min.y), this.max.y)
    result.z = Math.min(Math.max(result.z, this.min.z), this.max.z)

    return result
  }

  /**
   * Approximate the place at twhere to point first entered the collider.
   * NOTE: This is a quick hack to get something done. It fails near edges. Should be replaced with a raycasted approach!
   * @param point
   */
  getSurfacePoint(point: Vector3.ReadonlyVector3): Vector3.MutableVector3 {
    let surfacePoint: Vector3.MutableVector3

    if (!this.isPointInside(point)) {
      // If the point is outside, clamp to the closest
      surfacePoint = this.clampPoint(point)
    } else {
      // If it's inside, project to the closest boundary plane
      const distances: number[] = [
        Math.abs(point.x - this.min.x),
        Math.abs(point.y - this.min.y),
        Math.abs(point.z - this.min.z),
        Math.abs(point.x - this.max.x),
        Math.abs(point.y - this.max.y),
        Math.abs(point.z - this.max.z)
      ]

      let minIndex: number = 0
      let minDist: number = Number.MAX_VALUE
      for (let i = 0; i < distances.length; i++) {
        if (distances[i] < minDist) {
          minDist = distances[i]
          minIndex = i
        }
      }

      // Create a mutable copy of `point`
      surfacePoint = Vector3.create(point.x, point.y, point.z)

      switch (minIndex) {
        case 0:
          surfacePoint.x = this.min.x
          break
        case 1:
          surfacePoint.y = this.min.y
          break
        case 2:
          surfacePoint.z = this.min.z
          break
        case 3:
          surfacePoint.x = this.max.x
          break
        case 4:
          surfacePoint.y = this.max.y
          break
        case 5:
          surfacePoint.z = this.max.z
          break
      }
    }

    return surfacePoint
  }

  getFaceNormal(point: Vector3): Vector3 {
    const tolerance: number = 0.0001
    if (Math.abs(point.y - this.max.y) < tolerance) {
      return Vector3.Up()
    } else if (Math.abs(point.z - this.max.z) < tolerance) {
      return Vector3.Forward() // forward
    } else if (Math.abs(point.x - this.max.x) < tolerance) {
      return Vector3.Right() // right
    } else if (Math.abs(point.z - this.min.z) < tolerance) {
      return Vector3.Backward() // backward
    } else if (Math.abs(point.x - this.min.x) < tolerance) {
      return Vector3.Left() // left
    } else if (Math.abs(point.y - this.min.y) < tolerance) {
      return Vector3.Down()
    }
    // it does not describe a point directly on a face
    return Vector3.Zero()
  }

  raycast(ray: Rayo): boolean | undefined {
    // NOTE: Any component of direction could be 0!
    // to avoid a division by 0, you need to add
    // additional safety checks.
    const t1: number = (this.min.x - ray.origin.x) / Math.max(ray.direction.x, 0.001)
    const t2: number = (this.max.x - ray.origin.x) / Math.max(ray.direction.x, 0.001)
    const t3: number = (this.min.y - ray.origin.y) / Math.max(ray.direction.y, 0.001)
    const t4: number = (this.max.y - ray.origin.y) / Math.max(ray.direction.y, 0.001)
    const t5: number = (this.min.z - ray.origin.z) / Math.max(ray.direction.z, 0.001)
    const t6: number = (this.max.z - ray.origin.z) / Math.max(ray.direction.z, 0.001)

    const tmin: number = Math.max(Math.min(t1, t2), Math.min(t3, t4), Math.min(t5, t6))

    const tmax: number = Math.min(Math.max(t1, t2), Math.max(t3, t4), Math.max(t5, t6))

    if (tmax < 0) {
      // ray would intersect, but it is pointing away from the box
      return false
    }
    if (tmin > tmax) {
      // no intersection at all
      return false
    }

    // if tmin < 0, the origin is inside the box, so tmax is the right intersection point (indside collision pointing out)
    // otherwise, it's tmin
    this.hitPoint = ray.getPoint(tmin >= 0 ? tmin : tmax)
    // this.hitFaceNormal = ?;
  }

  logData(): void {
    console.log('center=')
    console.log(this.center)
    console.log('halfSize=')
    console.log(this.halfSize)
    console.log('min=')
    console.log(this.min)
    console.log('max=')
    console.log(this.max)
  }
}
