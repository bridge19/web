FROM registry.cn-hangzhou.aliyuncs.com/lingsheng/nginx:1.12.2-alpine
MAINTAINER sundengbo "sundengbo@gmail.com"

COPY dist /webserver/verbal-trick/app/static
