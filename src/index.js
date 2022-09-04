import Router from 'preact-router';
import { h } from 'preact';
import AsyncRoute from 'preact-async-route';

import './style';

function getHome(url, cb, props) {
    const componentOrPromise = import('./home.js');
    if (componentOrPromise.then) {
        return componentOrPromise.then(module => module.default);
    } else if (componentOrPromise.default) {
        cb({ component: componentOrPromise });
    }
}

function getPaste(url, cb, props) {
    const componentOrPromise = import('./paste.js');
    if (componentOrPromise.then) {
        return componentOrPromise.then(module => module.default);
    } else if (componentOrPromise.default) {
        cb({ component: componentOrPromise });
    }
}

export default function App() {
    return (
        <div id="app">
            <Router>
                <AsyncRoute path="/:uuid" getComponent={getPaste} />
                <AsyncRoute default getComponent={getHome} />
            </Router>
        </div>
    );
}
