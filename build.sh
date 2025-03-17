#!/bin/sh

[ ! -d "src/posts/$POST_SLUG/components" ] || cp -r "src/posts/$POST_SLUG/components" "out/posts/$POST_SLUG/"
