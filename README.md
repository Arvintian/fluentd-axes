# Fluentd-axes

> 集成[fluentd](https://www.fluentd.org/)和[阿里云日志服务(Log Service)](https://www.aliyun.com/product/sls)的日志收集方案

## Preview

![axes_0](https://github.com/Arvintian/fluentd-axes/blob/master/misc/axes_0.jpg)
![axes_1](https://github.com/Arvintian/fluentd-axes/blob/master/misc/axes_1.jpg)
![axes_2](https://github.com/Arvintian/fluentd-axes/blob/master/misc/axes_2.jpg)

## Getting Started

```
docker run -d -p 8000:8000 -p 24224:24224 -e SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:root@192.168.44.116:3306/fluentd-axes arvintian/fluentd-axes:1.1.0
```
浏览器中打开[http://0.0.0.0:8000/](http://0.0.0.0:8000)  
Fluentd daemon地址：0.0.0.0:24224

## Build

```
make depend
make build
```
环境要求：go、dep、python、pip、node、npm