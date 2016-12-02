Fuel DevOps Portal
==================

Installation
------------

Fuel DevOps Portal requires Node.js 4 or later and NPM 3 or later to be
installed on your system. To install dependencies run::

  npm install

Development
-----------

The most convenient approach to modify Fuel DevOps Portal is to use
a development server. It watches for file changes and automatically rebuilds
changed modules (significantly faster than full rebuild) and triggers
page refresh in browsers::

  npm start

By default it runs on port 8080 and assumes that Ceagle runs on
port 8000. You can override this by using the following options::

  npm start -- --dev-server-host=127.0.0.1 --dev-server-port=8080 --ceagle-host=127.0.0.1 --ceagle-port=8000

Production Build
----------------

The production version of Fuel DevOps Portal can be built by running::

  npm run build

The resulting build will be available in `dist` directory.

Running Portal with Docker
--------------------------

You have to run 2 docker containers one the same host:
- nginx that shares static files
- ceagle - which is portal backend

.. code-block:: sh

  docker run --name devops -d --net host seecloud/fuel-devops-portal
  docker run --name devops -d -p  8080:5000 seecloud/ceagle
  # UI is available on 80 port
