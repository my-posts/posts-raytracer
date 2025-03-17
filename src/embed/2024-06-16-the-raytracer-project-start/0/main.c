#include <stdint.h>
#include <stdio.h>

#include "../../write_image.h"

bmp_pixel_t renderer(void *context, float x, float y) {
  return (bmp_pixel_t){
    (uint8_t)(x * 255 + 0.5f),
    (uint8_t)(y * 255 + 0.5f),
    255,
  };
}

int main(int argc, char **argv) {
  if (argc != 2) {
    return 1;
  }

  write_image(argv[1], renderer, NULL, 256, 256);
}
