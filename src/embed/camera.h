#pragma once

#include "ray.h"

/**
 * @brief get ray from (x, y) in image
 */
typedef ray_t (*camera_get_ray_t)(void *context, float x, float y);

typedef struct camera {
  void *context;
  camera_get_ray_t get_ray;
} camera_t;

typedef enum camera_fov_mode {
  FOV_X,
  FOV_Y,
} camera_fov_mode_t;

camera_t perspective_camera(f3_t camera_position, float yaw, float pitch,
                            float roll, float aspect_ratio,
                            camera_fov_mode_t fov_mode, float fov);
camera_t perspective_camera_by_position(f3_t camera_position,
                                        f3_t look_at_position, float roll,
                                        float aspect_ratio,
                                        camera_fov_mode_t fov_mode, float fov);

typedef enum camera_size_mode {
  SIZE_WIDTH,
  SIZE_HEIGHT,
} camera_size_mode_t;

camera_t orthogonal_camera(f3_t camera_position, float yaw, float pitch,
                           float roll, float aspect_ratio,
                           camera_size_mode_t size_mode, float size);
camera_t orthogonal_camera_by_position(f3_t camera_position,
                                       f3_t look_at_position, float roll,
                                       float aspect_ratio,
                                       camera_size_mode_t size_mode,
                                       float size);
