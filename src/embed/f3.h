#pragma once

typedef struct f3 {
  float x;
  float y;
  float z;
} f3_t;

f3_t f3(float x, float y, float z);
f3_t f3_add(f3_t a, f3_t b);
f3_t f3_sub(f3_t a, f3_t b);
f3_t f3_mul1(f3_t a, float b);
f3_t f3_mul3(f3_t a, f3_t b);
f3_t f3_div1(f3_t a, float b);
f3_t f3_div3(f3_t a, f3_t b);
float f3_length(f3_t f3);
float f3_dot(f3_t a, f3_t b);
f3_t f3_cross(f3_t a, f3_t b);
f3_t f3_normalize(f3_t f3);
f3_t f3_rotate(f3_t point, f3_t rotation);
