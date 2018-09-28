docker run --rm --net=host -v $PWD:/frontend -v $PWD/docker-entrypoint.sh:/docker-entrypoint.sh registry.cn-hangzhou.aliyuncs.com/sun-docker/frontend_builder:8
CI_COMMIT_REF_NAME="$(git name-rev --name-only HEAD)"
docker build -t registry.cn-hangzhou.aliyuncs.com/lingsheng/verbal-trick:$CI_COMMIT_REF_NAME .
docker push registry.cn-hangzhou.aliyuncs.com/lingsheng/verbal-trick:$CI_COMMIT_REF_NAME
docker rmi registry.cn-hangzhou.aliyuncs.com/lingsheng/verbal-trick:$CI_COMMIT_REF_NAME