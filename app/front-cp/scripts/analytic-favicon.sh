#!/bin/bash

rm -rf ./static/_icons \
&& mkdir -p ./static/_icons \
&& cp -r ./node_modules/@aasaam/information/logo/service/htm/*.{png,ico,svg} ./static/_icons \
&& cp -r ./node_modules/@aasaam/information/logo/service/htm/favicon.ico ./static/
