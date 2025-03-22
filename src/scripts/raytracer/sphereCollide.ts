import { Direction } from "./Direction";
import { length } from "./length";
import { mul1 } from "./mul1";
import { normalize } from "./normalize";
import { Ray } from "./Ray";
import { Sphere } from "./Sphere";
import { sqr } from "./sqr";
import { sub } from "./sub";

export function sphereCollide(
  ray: Ray,
  sphere: Sphere,
): [normal: Direction, distance: number] | undefined {
  if (length(sub(ray.origin, sphere.center)) < sphere.radius) {
    return [mul1(ray.direction, -1), 0];
  }
  const newRayOrigin = sub(ray.origin, sphere.center);

  const a =
    sqr(ray.direction[0]) + sqr(ray.direction[1]) + sqr(ray.direction[2]);
  const b =
    2 *
    (newRayOrigin[0] * ray.direction[0] +
      newRayOrigin[1] * ray.direction[1] +
      newRayOrigin[2] * ray.direction[2]);
  const c =
    sqr(newRayOrigin[0]) +
    sqr(newRayOrigin[1]) +
    sqr(newRayOrigin[2]) -
    sqr(sphere.radius);
  const discriminant = sqr(b) - 4 * a * c;

  if (discriminant < 0) {
    return undefined;
  }
  let t = (-b - Math.sqrt(discriminant)) / (2 * a);
  if (t < 0) {
    t = (-b + Math.sqrt(discriminant)) / (2 * a);
    if (t < 0) {
      return undefined;
    }
  }

  const x = newRayOrigin[0] + ray.direction[0] * t;
  const y = newRayOrigin[1] + ray.direction[1] * t;
  const z = newRayOrigin[2] + ray.direction[2] * t;

  return [normalize([x * 2, y * 2, z * 2]), t];
}
