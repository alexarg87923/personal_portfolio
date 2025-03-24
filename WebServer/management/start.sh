#!/bin/bash
docker build -t production .
docker run -p 4000:4000 production
