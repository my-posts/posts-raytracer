#include <stdio.h>

#include "../../f3.h"
#include "../../write_image.h"

typedef struct ray {
  f3_t origin;
  f3_t direction;
} ray_t;

const float orthogonal_camera_scale = 2.0f;
const f3_t camera_position = {0, 0, 0};
const f3_t camera_direction = {0, 1, 0};
const bmp_pixel_t black = {0, 0, 0};
const bmp_pixel_t white = {255, 255, 255};

bmp_pixel_t renderer(void *context, float x_on_image, float y_on_image) {
  const float x = (2.0f * x_on_image - 1.0f) * orthogonal_camera_scale;
  // y_on_image는 높을수록 아래인데 z는 높을수록 위이므로, 반대로 처리
  const float z = -(2.0f * y_on_image - 1.0f) * orthogonal_camera_scale;
  const f3_t origin = f3_add(camera_position, f3(x, 0, z));
  const ray_t ray = {origin, camera_direction};

  if (ray.origin.z < 0.0f) {
    return black;
  }
  return white;
}

int main(int argc, char **argv) {
  if (argc != 2) {
    return 1;
  }

  write_image(argv[1], renderer, NULL, 480, 270);
}
