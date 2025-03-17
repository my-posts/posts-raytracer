#pragma once

#include <stddef.h>

#include "external/bmp.h"

typedef bmp_pixel_t (*renderer_t)(void *context, float x, float y);

void write_image(const char *output_path, renderer_t renderer, void *context,
                 size_t width, size_t height);
