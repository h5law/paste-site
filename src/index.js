import Router from 'preact-router';
import { h } from 'preact';

import Home from './home.js';
import Paste from './paste.js';
import './style';

export default function App() {
    return (
        <div id="app">
            <Router>
                <Paste path="/:uuid" />
                <Home default />
            </Router>
        </div>
    );
}
