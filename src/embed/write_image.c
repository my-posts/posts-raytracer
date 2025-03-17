#include "write_image.h"

#include <math.h>
#include <stdio.h>
#include <stdlib.h>

void write_image(const char *output_path, renderer_t renderer, void *context,
                 size_t width, size_t height) {
  const size_t pixel_count = width * height;
  bmp_t *bmp = malloc(sizeof(bmp_t) + sizeof(bmp_pixel_t) * pixel_count);
  if (!bmp) {
    fprintf(stderr, "memory allocation failure\n");
    exit(EXIT_FAILURE);
  }
  bmp->width = width;
  bmp->height = height;

  const size_t sqrt_pixel_count = (size_t)sqrtf((float)pixel_count);
  for (size_t y = 0; y < height; y++) {
    for (size_t x = 0; x < width; x++) {
      const size_t index = y * width + x;
      if (index % sqrt_pixel_count == 0) {
        printf("progress: %zu / %zu\n", index, pixel_count);
      }
      bmp->extra[index] =
          renderer(context, x / (width - 1.0f), y / (height - 1.0f));
    }
  }

  char *buffer;
  size_t length;
  if (serialize_bmp(bmp, &buffer, &length)) {
    fprintf(stderr, "memory allocation failure\n");
    exit(EXIT_FAILURE);
  }

  free(bmp);

  FILE *fp = fopen(output_path, "wb");
  if (!fp) {
    fprintf(stderr, "Failed to open %s\n", output_path);
    exit(EXIT_FAILURE);
  }
  if (fwrite(buffer, 1, length, fp) != length) {
    fprintf(stderr, "Failed to write to %s\n", output_path);
    exit(EXIT_FAILURE);
  }
  free(buffer);
  fclose(fp);

  printf("Successfully wrote image to %s\n", output_path);
}
