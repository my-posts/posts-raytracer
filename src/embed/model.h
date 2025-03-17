#pragma once

#include "f3.h"
#include "material.h"
#include "ray.h"

typedef bool (*model_collide_t)(void *context, ray_t ray, f3_t *out_normal,
                                float *out_distance, material_t *out_material);

typedef struct model {
  void *context;
  model_collide_t collide;
} model_t;
