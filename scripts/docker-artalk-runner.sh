#!/bin/bash
if [ -e /usr/data/artalk.yml ]; then
    /artalk -w / -c /usr/data/artalk.yml "$@"
else
    /artalk -w / -c /usr/data/artalk-go.yml "$@"
fi
