#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Testacular Server (http://vojtajina.github.com/testacular)"
echo "Unit tests running"
echo "-------------------------------------------------------------------"

testacular start $BASE_DIR/../config/testacular-unit.conf.js $*
