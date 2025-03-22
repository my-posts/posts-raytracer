export function mul1(
  vec: [x: number, y: number, z: number],
  n: number,
): [x: number, y: number, z: number] {
  return [vec[0] * n, vec[1] * n, vec[2] * n];
}
