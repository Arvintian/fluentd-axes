FROM alpine:3.7

ENV FLUENTD_VERSION=1.2.5
ENV DUMB_INIT_VERSION=1.2.0
ENV SU_EXEC_VERSION=0.2
# Do not split this into multiple RUN!
# Docker creates a layer for every RUN-Statement
# therefore an 'apk delete' has no effect
RUN apk update \
    && apk upgrade \
    && apk add --no-cache \
    ca-certificates \
    ruby ruby-irb \
    su-exec==${SU_EXEC_VERSION}-r0 \
    dumb-init==${DUMB_INIT_VERSION}-r0 \
    && apk add --no-cache --virtual .build-deps \
    build-base \
    ruby-dev wget gnupg \
    && update-ca-certificates \
    && echo 'gem: --no-document' >> /etc/gemrc \
    && gem install oj -v 3.3.10 \
    && gem install json -v 2.1.0 \
    && gem install fluentd -v ${FLUENTD_VERSION} \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/* /var/tmp/* /usr/lib/ruby/gems/*/cache/*.gem
# for log storage (maybe shared with host)
RUN mkdir -p /fluentd/log
# configuration/plugins path (default: copied from .)
RUN mkdir -p /fluentd/etc /fluentd/plugins
# fluentd plugins
RUN gem install fluent-plugin-kafka && gem install fluent-plugin-aliyun-sls

# python
RUN apk add --no-cache --virtual .build-deps  \
    bzip2-dev \
    coreutils \
    dpkg-dev dpkg \
    expat-dev \
    findutils \
    gcc \
    gdbm-dev \
    libc-dev \
    libffi-dev \
    libnsl-dev \
    openssl-dev \
    libtirpc-dev \
    linux-headers \
    make \
    ncurses-dev \
    pax-utils \
    readline-dev \
    sqlite-dev \
    tcl-dev \
    tk \
    tk-dev \
    util-linux-dev \
    xz-dev \
    zlib-dev
RUN apk add python3
RUN apk add python3-dev
RUN pip3 install --upgrade pip

# other
RUN apk add ca-certificates wget curl openssl lsof

# apiserver
COPY dist/apiserver-1.0.0.tar.gz /tmp/
RUN pip3 install /tmp/apiserver-1.0.0.tar.gz

# bin
ADD template.conf /fluentd/etc/
ENV FILEPATH /fluentd/etc
ADD fluentd-axes /bin/

CMD ["/bin/fluentd-axes"]