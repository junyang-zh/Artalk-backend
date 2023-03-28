#!/bin/bash
set -e

if [ "$1" != 'gen' ] && ( [ ! -e /usr/data/artalk.yml ] && [ ! -e /usr/data/artalk-go.yml ] ); then
    if [ -e /conf.yml ]; then
        # Move original config to `/usr/data/` for upgrade (<= v2.1.8)
        cp /conf.yml /usr/data/artalk.yml
        upMsg=""
        upMsg+=$'# [v2.1.9+ Updated]\n'
        upMsg+=$'# The new version of the Artalk container recommends mounting\n'
        upMsg+=$'# an entire folder instead of a single file to avoid some issues.\n'
        upMsg+=$'#\n'
        upMsg+=$'# The original config file has been moved to the "/usr/data/" folder,\n'
        upMsg+=$'# please unmount the config file volume from your container\n'
        upMsg+=$'# and edit "/usr/data/artalk.yml" for configuration.'
        echo "$upMsg" > /conf.yml
        echo "$(date) [info] Copy config file from '/conf.yml' to '/usr/data/artalk.yml' for upgrade"
    else
        # Generate new config
        artalk gen conf /usr/data/artalk.yml
        echo "$(date) [info] Generate new config file to '/usr/data/artalk.yml'"
    fi
    # Add an admin
    printf "$ADMIN_USERNAME\n$ADMIN_EMAIL\n$ADMIN_PASSWORD\n$ADMIN_PASSWORD\n" | artalk admin
fi

# Run Artalk
/usr/bin/artalk "$@"
