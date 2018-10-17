# coding:utf-8

from apiserver import db


class Target(db.Model):
    __tablename__ = "targets"
    id = db.Column("id", db.Integer, primary_key=True)
    # app
    name = db.Column("name", db.String(64), unique=True, nullable=False)
    target = db.Column("target", db.String(64), unique=True)
    # kafka
    brokers = db.Column("brokers", db.String(128))
    topic = db.Column("topic", db.String(64))
    # aliyun sls
    sls_access_key_id = db.Column("sls_access_key_id", db.String(64))
    sls_access_key_secret = db.Column("sls_access_key_secret", db.String(64))
    sls_project = db.Column("sls_project", db.String(64))
    sls_region_endpoint = db.Column("sls_region_endpoint", db.String(64))
    sls_logstore = db.Column("sls_logstore", db.String(64))
    sls_need_create_logstore = db.Column("sls_need_create_logstore", db.Boolean)
    # buffer
    interval = db.Column("interval", db.Integer)

    @property
    def enable_kafka(self):
        if self.target and self.brokers and self.topic:
            return True
        return False

    @property
    def enable_sls(self):
        if self.target and self.sls_access_key_id and self.sls_access_key_secret and \
                self.sls_project and self.sls_region_endpoint and self.sls_logstore:
            return True
        return False

    def kafka_config(self):
        if self.enable_kafka:
            return {
                "kafkaEnable": "true",
                "target": self.target,
                "brokers": self.brokers,
                "topic": self.topic
            }
        return {
            "kafkaEnable": "false"
        }

    def sls_config(self):
        if self.enable_sls:
            config = {
                "slsEnalbe": "true",
                "target": self.target,
                "sls_access_key_id": self.sls_access_key_id,
                "sls_access_key_secret": self.sls_access_key_secret,
                "sls_project": self.sls_project,
                "sls_region_endpoint": self.sls_region_endpoint,
                "sls_logstore": self.sls_logstore,
            }
            if self.sls_need_create_logstore is False:
                config.update({
                    "sls_need_create_logstore": "false"
                })
            else:
                config.update({
                    "sls_need_create_logstore": "true"
                })
            return config
        return {
            "slsEnalbe": "false"
        }

    def buffer_config(self):
        if self.interval is None:
            return {
                "interval": "3"
            }
        return {
            "interval": str(self.interval)
        }
