#!/bin/sh
echo "    location ~* ^\/api\/(sendsms|verifysms|cross|wechatAuth|login).* {
                  rewrite    ^/api/(.*)$ /api/\$1 break;
                  proxy_pass http://$NG_PROXY_DOCKER_API_HOST;
              }
           location /api/ {
                  rewrite    ^/api/(.*)$ /api/\$1 break;
                  proxy_pass http://$NG_PROXY_API_HOST;
              }
           location /upload/ {
                  proxy_pass http://$NG_PROXY_UPLOAD_HOST;
              }
              ">/etc/nginx/proxyapi.conf

/usr/sbin/nginx
