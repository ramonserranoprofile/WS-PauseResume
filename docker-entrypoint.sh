#!/bin/bash
renice -n -10 -p $$
exec npm start
