import { length } from "./length";
import { mul1 } from "./mul1";

export function normalize(
  vec: [x: number, y: number, z: number],
): [x: number, y: number, z: number] {
  return mul1(vec, 1 / length(vec));
}
