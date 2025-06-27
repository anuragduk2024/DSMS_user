#!/bin/bash

# Get list of files
wget https://wardmap.ksmart.live/files/district_localbody_mapping.json

# Extract URLs
cat district_localbody_mapping.json | grep 'https' | cut -d '"' -f 4 | sort > urls.txt

# Create directory for files
mkdir -p raw

# Download files, 5 seconds gap between each download
IFS=$'\n'; for i in $(cat urls.txt); do wget "$i" -P ./raw/ && sleep 5; done

# Merge the files using geojson-merge or a tool like https://findthatpostcode.uk/tools/merge-geojson
#geojson-merge raw/*json > KL_Wards.geojson

# Convert GeoJSON to FlatGeobuf
#ogr2ogr KL_Wards.fgb KL_Wards.geojson
