# coding:utf-8

from apiserver import db


class Target(db.Model):
    __tablename__ = "targets"
    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column("name", db.String(64), unique=True, nullable=False)
    target = db.Column("target", db.String(64), unique=True)
    brokers = db.Column("brokers", db.String(128))
    topic = db.Column("topic", db.String(64))
    interval = db.Column("interval", db.Integer)

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "target": self.target,
            "brokers": self.brokers,
            "topic": self.topic,
            "interval": str(self.interval)
        }
