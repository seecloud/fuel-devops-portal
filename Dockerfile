FROM ubuntu:16.04
MAINTAINER Vitaly Kramskikh <vkramskikh@mirantis.com>

RUN apt-get update && apt-get install --yes wget git-core nodejs npm
RUN apt-get remove node

RUN ln /usr/bin/nodejs /usr/bin/node

COPY . /app
WORKDIR /app

RUN npm install

EXPOSE 5000
ENTRYPOINT ["npm"]
CMD ["start", "--", "--dev-server-host=0.0.0.0", "--dev-server-port=5000"] 
