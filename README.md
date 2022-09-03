# paste-site

This is a simple Preact frontend for the [paste-server](https://github.com/h5law/paste-server)

## Install

This requires Node v16.16.0+

To install simply clone this repo and install the npm dependencies:
```
git clone https://github.com/h5law/paste-site
cd paste-site
npm i
```

Then to run in a non production environment do either:
`NODE_ENV="development" npm run dev` or `NODE_ENV="development" npm run serve`

It is needed to use the `NODE_ENV` before the command so that the SPA looks for
the paste-server instance running locally on `127.0.0.1:3000` for the API calls
as otherwise the SPA will assume this is being served through the paste-server
instance it is made for, and will use the `window.location.origin` value for
making API calls which wont work unless the paste-instance server is both
running AND on the same port.

## Build

To build this yourself simply run:
```
npm run build
```

## TODO

- Add update & delete support
- Make look and feel better
