#!/bin/bash

while read slug; do
  s=$(echo "$slug" | tr -d '"')
  echo "importing $s"

  curl -X POST \
    https://platezero.com/api/user/import/url \
    -H "Authorization: Bearer INSERT_TOKEN_HERE" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "{\"url\":\"https://www.blueapron.com/recipes/$s\"}" \
    -s \
    -i

  echo -e "\n\n"
  CURL_RETURN_CODE=$?
  if [ ${CURL_RETURN_CODE} -ne 0 ]; then  
    echo "Curl failed!"
  fi

  echo "sleeping 2s then continuing..."
  sleep 2s
done <slugs.txt
