#pragma once

typedef struct color {
  float r;
  float g;
  float b;
} color_t;

typedef color_t (*material_get_color_t)(void *context);
typedef void (*material_free_context)(void *context);

typedef struct material {
  void *context;
  material_get_color_t get_color;
  material_free_context free_context;
} material_t;
