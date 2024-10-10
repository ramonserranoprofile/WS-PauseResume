#!/bin/sh
npm start &
PID=$!
renice -n -10 -p $PID
wait $PID