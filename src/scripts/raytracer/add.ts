import { Direction } from "./Direction";
import { Position } from "./Position";

export function add(to: Position, from: Position): Direction {
  return [to[0] + from[0], to[1] + from[1], to[2] + from[2]];
}
