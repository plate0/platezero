#!/bin/bash

PAGE=$1

# Needs Cookie with Auth
curl "https://www.blueapron.com/api/subscriptions/3905692/orders/past?per_page=50&page=$PAGE" -H 'x-newrelic-id: UwQCV1RWGwcFU1BbAQg=' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36' -H 'accept: application/json, text/javascript, */*; q=0.01' -H 'referer: https://www.blueapron.com/account' -H 'authority: www.blueapron.com' -H 'x-requested-with: XMLHttpRequest' --compressed | jq '.orders[] | .recipes[] | .slug' >> slugs.txt
