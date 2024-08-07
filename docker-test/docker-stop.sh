#!/bin/bash
docker rm $(docker stop $(docker ps -a -q --filter ancestor=eofol3-test --format="{{.ID}}"))
