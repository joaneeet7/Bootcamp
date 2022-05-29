#!/bin/bash
docker build -t loteria:v1 .                    
docker run -p 3000:3000 loteria:v1 entrypoint.sh