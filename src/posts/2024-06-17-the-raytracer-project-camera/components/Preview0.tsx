"use client";

import { InteractiveCanvas } from "@my-posts/components-code/InteractiveCanvas";
import { InteractiveCanvasOptionDescriptor } from "@my-posts/components-code/InteractiveCanvasOptionDescriptor";
import { floatOption } from "@my-posts/components-code/option/floatOption";
import { integerOption } from "@my-posts/components-code/option/integerOption";
import { add } from "../../../scripts/raytracer/add";
import { Direction } from "../../../scripts/raytracer/Direction";
import { Position } from "../../../scripts/raytracer/Position";
import { Ray } from "../../../scripts/raytracer/Ray";
import { Sphere } from "../../../scripts/raytracer/Sphere";
import { sphereCollide } from "../../../scripts/raytracer/sphereCollide";
import { spheresOption } from "../../../scripts/raytracer/spheresOption";

interface State {
  "1-size": number;
  "2-orthogonal-camera-scale": number;
  "5-spheres": Sphere[];
}

const options: InteractiveCanvasOptionDescriptor<State> = {
  "1-size": integerOption("이미지 크기", 512, { max: 3840, min: 1 }),
  "2-orthogonal-camera-scale": floatOption("카메라 크기", 3),
  "5-spheres": spheresOption("물체(구)들", [
    { center: [-2, 3, 0], radius: 1 },
    { center: [3, 5, 0], radius: 1 },
    { center: [0, 5, 0], radius: 0.1 },
  ]),
};

const cameraPosition: Position = [0, 0, 0];
const cameraDirection: Direction = [0, 1, 0];

export function Preview0() {
  return <InteractiveCanvas options={options} render={render} />;
}

function render({
  "1-size": size,
  "2-orthogonal-camera-scale": orthogonalCameraScale,
  "5-spheres": spheres,
}: State): ImageData {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b] = renderPixel(
        x / (size - 1),
        y / (size - 1),
        orthogonalCameraScale,
        cameraPosition,
        cameraDirection,
        spheres
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
  orthogonalCameraScale: number,
  cameraPosition: Position,
  cameraDirection: Direction,
  spheres: Sphere[]
): [r: number, g: number, b: number] {
  const x = (2 * xOnImage - 1) * orthogonalCameraScale;
  const z = -(2 * yOnImage - 1) * orthogonalCameraScale;
  const origin = add(cameraPosition, [x, 0, z]);
  const ray: Ray = { origin, direction: cameraDirection };

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
