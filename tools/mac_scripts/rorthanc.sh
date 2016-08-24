#!/bin/bash
pid="$(ps -fe | grep '[O]rthanc' | awk '{print$2}')"

echo 'Orthanc:'$pid

if [[ -n $pid ]]; then
	kill -9 $pid
	"killed"
else
	echo 'Error not exists'
fi
