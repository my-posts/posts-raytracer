#include "f3x3.h"

#include <math.h>

f3x3_t f3x3(f3_t x, f3_t y, f3_t z) { return (f3x3_t){x, y, z}; }

f3_t f3x3_col_x(f3x3_t f3x3) { return (f3_t){f3x3.x.x, f3x3.y.x, f3x3.z.x}; }

f3_t f3x3_col_y(f3x3_t f3x3) { return (f3_t){f3x3.x.y, f3x3.y.y, f3x3.z.y}; }

f3_t f3x3_col_z(f3x3_t f3x3) { return (f3_t){f3x3.x.z, f3x3.y.z, f3x3.z.z}; }

f3x3_t f3x3_mul(f3x3_t a, f3x3_t b) {
  const f3_t x = {
      f3_dot(a.x, f3x3_col_x(b)),
      f3_dot(a.x, f3x3_col_y(b)),
      f3_dot(a.x, f3x3_col_z(b)),
  };
  const f3_t y = {
      f3_dot(a.y, f3x3_col_x(b)),
      f3_dot(a.y, f3x3_col_y(b)),
      f3_dot(a.y, f3x3_col_z(b)),
  };
  const f3_t z = {
      f3_dot(a.z, f3x3_col_x(b)),
      f3_dot(a.z, f3x3_col_y(b)),
      f3_dot(a.z, f3x3_col_z(b)),
  };

  return f3x3(x, y, z);
}

f3x3_t f3x3_transpose(f3x3_t m) {
  return f3x3(f3x3_col_x(m), f3x3_col_y(m), f3x3_col_z(m));
}

static f3x3_t rotate_yaw(float rad) {
  const f3_t x = {
      cosf(rad),
      sinf(rad),
      0,
  };
  const f3_t y = {
      -sinf(rad),
      cosf(rad),
      0,
  };
  const f3_t z = {
      0,
      0,
      1,
  };

  return f3x3(x, y, z);
}

static f3x3_t rotate_pitch(float rad) {
  const f3_t x = {
      1,
      0,
      0,
  };
  const f3_t y = {
      0,
      cosf(rad),
      sinf(rad),
  };
  const f3_t z = {
      0,
      -sin(rad),
      cos(rad),
  };

  return f3x3(x, y, z);
}

static f3x3_t rotate_roll(float rad) {
  const f3_t x = {
      cosf(rad),
      0,
      sinf(rad),
  };
  const f3_t y = {
      0,
      1,
      0,
  };
  const f3_t z = {
      -sinf(rad),
      0,
      cosf(rad),
  };

  return f3x3(x, y, z);
}

f3x3_t f3x3_rotate(float yaw, float pitch, float roll) {
  const f3x3_t mat_yaw = rotate_yaw(yaw);
  const f3x3_t mat_pitch = rotate_pitch(pitch);
  const f3x3_t mat_roll = rotate_roll(roll);

  return (f3x3_mul(f3x3_mul(mat_yaw, mat_pitch), mat_roll));
}

f3x3_t f3x3_rotate_reverse(float yaw, float pitch, float roll) {
  return f3x3_transpose(f3x3_rotate(yaw, pitch, roll));
}

f3_t f3x3_mul_f3(f3_t vec, f3x3_t mat) {
  return f3(f3_dot(mat.x, vec), f3_dot(mat.y, vec), f3_dot(mat.z, vec));
}

f3x3_t f3x3_i = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};
