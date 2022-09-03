import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw/';

setupRouting();

const urlsToCache = getFiles();
urlsToCache.push({url: '/favicon.ico', revision: null});

setupPrecaching(urlsToCache);
