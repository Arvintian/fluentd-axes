# coding:utf-8

from apiserver import db


class Default(db.Model):
    __tablename__ = "default"
    id = db.Column("id", db.Integer, primary_key=True)
    brokers = db.Column("brokers", db.String(128), nullable=False)
    topic = db.Column("topic", db.String(64), nullable=False)
    interval = db.Column("interval", db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "brokers": self.brokers,
            "topic": self.topic,
            "interval": str(self.interval)
        }
