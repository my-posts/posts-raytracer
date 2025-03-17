#include "camera.h"

#include "f3x3.h"
#include "util.h"

typedef struct orthogonal_camera_context {
  float width;
  float height;
  f3_t origin;
  f3_t direction;
  f3x3_t rotation;
} orthogonal_camera_context_t;

static ray_t get_ray(void *context, float x, float y) {
  orthogonal_camera_context_t *const ctx = context;
  const float offset_x = ctx->width * (x * 2.0f - 1.0f);
  const float offset_y = 0.0f;
  const float offset_z = -ctx->height * (y * 2.0f - 1.0f);
  const f3_t offset = {offset_x, offset_y, offset_z};
  const f3_t rotated = f3x3_mul_f3(offset, ctx->rotation);
  const f3_t origin = f3_add(ctx->origin, rotated);
  const ray_t result = {origin, ctx->direction};
  return result;
}

camera_t orthogonal_camera(f3_t camera_position, float yaw, float pitch,
                           float roll, float aspect_ratio,
                           camera_size_mode_t size_mode, float size) {
  orthogonal_camera_context_t context;
  if (size_mode == SIZE_WIDTH) {
    context.width = size;
    context.height = size / aspect_ratio;
  } else {
    context.width = size * aspect_ratio;
    context.height = size;
  }
  context.origin = camera_position;
  context.rotation = f3x3_rotate(yaw, pitch, roll);
  context.direction = f3x3_mul_f3(f3(0, 1, 0), context.rotation);
  const camera_t result = {memdup(&context, sizeof(context)), get_ray};
  return result;
}
