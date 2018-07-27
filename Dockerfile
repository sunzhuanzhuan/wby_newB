#Version 1.0  bentley front project basic on alpine

FROM harbor.weiboyi.com/wby/nginx-alpine-base:1.0
MAINTAINER  andylhz  "liuhongzhi@weiboyi.com"

COPY ./build/ /var/www/Bentley-Front/
COPY ./bentley-front.conf /etc/nginx/conf.d/
COPY ./mknginxproxyapiconf.sh /wby/entrypoint-devbox.sh
RUN chmod +x /wby/entrypoint-devbox.sh

VOLUME  ["/var/log/nginx","/var/log/application"]

LABEL aliyun.logs.nginx=stdout aliyun.logs.bentley_nginx_access=/var/log/nginx/bentley_access-*.log aliyun.logs.bentley_nginx_access.tags="name=bentley_nginx_access" aliyun.logs.nginx=stdout aliyun.logs.bentley_nginx_error=/var/log/nginx/bentley_error-*.log aliyun.logs.bentley_nginx_error.tags="name=bentley_nginx_error"

EXPOSE  80
#Supervisord start nginx php-fpm
CMD ["/wby/entrypoint-devbox.sh"]
