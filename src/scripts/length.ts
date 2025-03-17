export function length(vec: [x: number, y: number, z: number]): number {
  return Math.sqrt(vec.map((x) => x * x).reduce((acc, curr) => acc + curr));
}
