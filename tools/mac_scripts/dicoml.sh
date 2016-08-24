#!/bin/bash
status="$1"

if [ $status = 'load' ]
then
echo "Loadinf dicom Agents..."
   launchctl load /Library/LaunchAgents/com.dicom.job.plist
   launchctl load /Library/LaunchAgents/com.dicom.day.plist
   launchctl load /Library/LaunchAgents/com.dicom.del.plist
echo "List of loaded dicom agents..."
launchctl list | grep dicom
fi

if [ $status = 'unload' ]
then
	echo "unloading dicom Agents..."
   	launchctl unload /Library/LaunchAgents/com.dicom.job.plist 
   	launchctl unload /Library/LaunchAgents/com.dicom.day.plist 
   	launchctl unload /Library/LaunchAgents/com.dicom.del.plist
	echo "Check if are unloaded..."
	launchctl list | grep dicom
fi
