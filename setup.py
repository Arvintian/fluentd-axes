# Copyright (c) v87.us Development Team.

import os
import sys
from distutils.core import setup
from setuptools import find_packages

os.chdir(os.path.dirname(sys.argv[0]) or ".")
here = os.path.abspath(os.path.dirname(__file__))

setup_args = dict(
    name='apiserver',
    version="1.0.0",
    description='Some descriptions',
    author='arvin',
    author_email="arvintian8@gmail.com",
    license='WTF',
    url='https://git.v87.us/tianweiguo/fluentd-axes',
    packages=find_packages(),
    include_package_data=True,
)

if 'setuptools' in sys.modules:
    setup_args['zip_safe'] = False
    setup_args['install_requires'] = install_requires = []

    with open('requirements.txt') as f:
        for line in f.readlines():
            req = line.strip()
            if not req or req.startswith('#') or '://' in req:
                continue
            install_requires.append(req)


def main():
    setup(**setup_args)


if __name__ == '__main__':
    main()
