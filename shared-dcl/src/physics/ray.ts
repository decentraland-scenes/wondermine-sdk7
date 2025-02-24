import { Plane, Vector3 } from '@dcl/sdk/math'
import { type AABB } from './aabb'

declare type Ray = {
  origin: Vector3
  direction: Vector3
  distance: number
}

export class Rayo implements Ray {
  public origin: Vector3.ReadonlyVector3
  public direction: Vector3.ReadonlyVector3
  public distance: number

  public endPoint: Vector3.ReadonlyVector3
  public normDirection: Vector3.MutableVector3

  constructor(_origin: Vector3.ReadonlyVector3, _endPoint: Vector3.ReadonlyVector3) {
    this.origin = _origin
    this.endPoint = _endPoint

    // Calcular dirección normalizada
    this.direction = Vector3.subtract(_endPoint, _origin)
    this.distance = Vector3.distance(this.origin, this.endPoint)
    this.normDirection = Vector3.create(0, 0, 0) // Inicialización mutable
    this.normalize()
  }

  normalize(): void {
    if (this.direction !== null) {
      this.normDirection = Vector3.normalize(this.direction)
    } else {
      this.normDirection = Vector3.Up()
    }
  }

  getPoint(dist: number): Vector3.MutableVector3 {
    if (this.normDirection === null) {
      this.normalize()
    }
    return Vector3.add(Vector3.multiplyByFloats(this.normDirection, dist, dist, dist), this.origin)
  }

  getEndpoint(): Vector3.MutableVector3 {
    return Vector3.add(this.origin, this.direction)
  }

  intersectsPlane(plane: Plane.ReadonlyPlane): boolean {
    const distToPoint = Plane.signedDistanceTo(plane, this.origin)
    if (distToPoint === 0) {
      return true
    }

    const denominator = Vector3.dot(plane.normal, this.direction)
    return denominator * distToPoint < 0
  }

  intersectsBox(box: AABB): number {
    const t: number = this.intersectsBoxNormalized(box)
    return t <= this.distance ? t : -1
  }

  intersectsBoxNormalized(box: AABB): number {
    const normX = this.normDirection.x === 0 ? 0.0001 : this.normDirection.x
    const normY = this.normDirection.y === 0 ? 0.0001 : this.normDirection.y
    const normZ = this.normDirection.z === 0 ? 0.0001 : this.normDirection.z

    const t1: number = (box.min.x - this.origin.x) / normX
    const t2: number = (box.max.x - this.origin.x) / normX
    const t3: number = (box.min.y - this.origin.y) / normY
    const t4: number = (box.max.y - this.origin.y) / normY
    const t5: number = (box.min.z - this.origin.z) / normZ
    const t6: number = (box.max.z - this.origin.z) / normZ

    const tmin: number = Math.max(Math.min(t1, t2), Math.min(t3, t4), Math.min(t5, t6))
    const tmax: number = Math.min(Math.max(t1, t2), Math.max(t3, t4), Math.max(t5, t6))

    if (tmax < 0 || tmin > tmax) {
      return -1
    }

    return tmin < 0 ? tmax : tmin
  }
}
