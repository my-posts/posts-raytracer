#include "f3.h"

#include <math.h>

#include "f3x3.h"

f3_t f3(float x, float y, float z) { return (f3_t){x, y, z}; }

f3_t f3_add(f3_t a, f3_t b) { return (f3_t){a.x + b.x, a.y + b.y, a.z + b.z}; }

f3_t f3_sub(f3_t a, f3_t b) { return (f3_t){a.x - b.x, a.y - b.y, a.z - b.z}; }

f3_t f3_mul1(f3_t a, float b) { return (f3_t){a.x * b, a.y * b, a.z * b}; }

f3_t f3_mul3(f3_t a, f3_t b) { return (f3_t){a.x * b.x, a.y * b.y, a.z * b.z}; }

f3_t f3_div1(f3_t a, float b) { return (f3_t){a.x / b, a.y / b, a.z / b}; }

f3_t f3_div3(f3_t a, f3_t b) { return (f3_t){a.x / b.x, a.y / b.y, a.z / b.z}; }

float f3_length(f3_t f3) {
  return sqrtf(f3.x * f3.x + f3.y * f3.y + f3.z * f3.z);
}

float f3_dot(f3_t a, f3_t b) { return a.x * b.x + a.y * b.y + a.z * b.z; }

f3_t f3_cross(f3_t a, f3_t b) {
  return (f3_t){a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z,
                a.x * b.y - a.y * b.x};
}

f3_t f3_normalize(f3_t f3) { return f3_div1(f3, f3_length(f3)); }

f3_t f3_rotate(f3_t point, f3_t rotation) {
  const float yaw = rotation.x;
  const float pitch = rotation.y;
  const float roll = rotation.z;

  return (f3x3_mul_f3(point, f3x3_rotate(yaw, pitch, roll)));
}
