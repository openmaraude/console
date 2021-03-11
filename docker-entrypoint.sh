#!/bin/bash

BUILD=${BUILD:-prod}

ln -sfn /builds/${BUILD} /var/www/console

exec "$@"
