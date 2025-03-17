"use client";

import { InteractiveCanvas } from "@my-posts/components-code/InteractiveCanvas";
import { InteractiveCanvasOptionDescriptor } from "@my-posts/components-code/InteractiveCanvasOptionDescriptor";
import { floatOption } from "@my-posts/components-code/option/floatOption";
import { integerOption } from "@my-posts/components-code/option/integerOption";
import { vec3Option } from "@my-posts/components-code/option/vec3Option";
import { Direction } from "../../../scripts/Direction";
import { normalize } from "../../../scripts/normalize";
import { Position } from "../../../scripts/Position";
import { Ray } from "../../../scripts/Ray";
import { Sphere } from "../../../scripts/Sphere";
import { sphereCollide } from "../../../scripts/sphereCollide";
import { spheresOption } from "../../../scripts/spheresOption";

interface State {
  "1-size": number;
  "2-perspective-camera-fov": number;
  "3-camera-position": Position;
  // '4-camera-direction': Direction;
  "5-spheres": Sphere[];
}

const options: InteractiveCanvasOptionDescriptor<State> = {
  "1-size": integerOption("이미지 크기", 512, { max: 3840, min: 1 }),
  "2-perspective-camera-fov": floatOption(
    "카메라 시야각 (라디안)",
    1.5707963267948966,
  ),
  "3-camera-position": vec3Option("카메라 위치", [0, 0, 0]),
  // '4-camera-direction': normal3Option('카메라 방향', [0, 1, 0]),
  "5-spheres": spheresOption("물체(구)들", [
    { center: [-2, 3, 0], radius: 1 },
    { center: [3, 5, 0], radius: 1 },
    { center: [0, 5, 0], radius: 0.1 },
  ]),
};

export function Preview1() {
  return <InteractiveCanvas options={options} render={render} />;
}

function render({
  "1-size": size,
  "2-perspective-camera-fov": perspectiveCameraFov,
  "3-camera-position": cameraPosition,
  // '4-camera-direction': cameraDirection,
  "5-spheres": spheres,
}: State): ImageData {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = renderPixel(
        x / (size - 1),
        y / (size - 1),
        perspectiveCameraFov,
        cameraPosition,
        // cameraDirection,
        spheres,
      );

      data[(y * size + x) * 4] = r;
      data[(y * size + x) * 4 + 1] = g;
      data[(y * size + x) * 4 + 2] = b;
      data[(y * size + x) * 4 + 3] = 255;
    }
  }
  return new ImageData(data, size, size);
}

function renderPixel(
  xOnImage: number,
  yOnImage: number,
  perspectiveCameraFov: number,
  cameraPosition: Position,
  // cameraDirection: Direction,
  spheres: Sphere[],
): [r: number, g: number, b: number] {
  const x = Math.tan(((2 * xOnImage - 1) * perspectiveCameraFov) / 2);
  const z = -Math.tan(((2 * yOnImage - 1) * perspectiveCameraFov) / 2);
  const direction: Direction = normalize([x, 1, z]);
  const ray: Ray = { origin: cameraPosition, direction };

  let collide: ReturnType<typeof sphereCollide>;
  for (const sphere of spheres) {
    const tmp = sphereCollide(ray, sphere);
    if (tmp) {
      if (!collide || collide[1] > tmp[1]) {
        collide = tmp;
      }
    }
  }

  const normal = collide ? collide[0] : [0, 0, 0];

  return [
    Math.floor((normal[0] * 0.5 + 0.5) * 255 + 0.5),
    Math.floor((normal[1] * 0.5 + 0.5) * 255 + 0.5),
    Math.floor((normal[2] * 0.5 + 0.5) * 255 + 0.5),
  ];
}
