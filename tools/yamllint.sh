#!/bin/bash
set -ex

workdir=$(dirname $0)
yamllint -c $workdir/yamllint.yaml \
    $(find . -not -path '*/\.*' -not -path '*node_modules*' -type f -name '*.yaml')
