#include "util.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void *alloc(size_t size) {
  void *const result = malloc(size);
  if (!result) {
    fprintf(stderr, "Failed to allocate memory\n");
    exit(EXIT_FAILURE);
  }
  return result;
}

void *memdup(void *mem, size_t length) {
  void *const result = alloc(length);
  memcpy(result, mem, length);
  return result;
}
