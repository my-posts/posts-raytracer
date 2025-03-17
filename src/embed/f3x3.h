#pragma once

#include "f3.h"

typedef struct f3x3
{
  f3_t x;
  f3_t y;
  f3_t z;
} f3x3_t;

f3x3_t f3x3(f3_t x, f3_t y, f3_t z);
f3_t f3x3_col_x(f3x3_t mat);
f3_t f3x3_col_y(f3x3_t mat);
f3_t f3x3_col_z(f3x3_t mat);
f3x3_t f3x3_mul(f3x3_t a, f3x3_t b);
f3x3_t f3x3_transpose(f3x3_t mat);
f3x3_t f3x3_rotate(float yaw, float pitch, float roll);
f3x3_t f3x3_rotate_reverse(float yaw, float pitch, float roll);
f3_t f3x3_mul_f3(f3_t vec, f3x3_t mat);

extern f3x3_t f3x3_i;
