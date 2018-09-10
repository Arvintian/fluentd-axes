# -*- coding:utf-8 -*-

from apiserver import app


def main():
    app.run(host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
