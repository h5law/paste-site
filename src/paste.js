import { useState, useEffect } from 'preact/hooks';

import { getPaste } from './api.js';

function Content({ resp }) {
    const [content, setContent] = useState(resp.content);
    const [ft, setFt] = useState(resp.filetype);
    const [ea, setEa] = useState(resp.expiresAt);

    const textAreaStyle = {
        width: `99%`,
        maxHeight: `99%`,
    };

    const languageStr = `language-${ft}`;

    return (
        <pre id="code-container">
            <code class={languageStr}>
                <textarea id="code" name="paste-code" autofocus rows="30"
                          style={textAreaStyle} value={content.join("\n")}>
                </textarea>
            </code>
        </pre>
    );
}

function ErrorMessage({ resp }) {
    if (Object.keys(resp).length < 1) {
        return
    }
    return (
        <ul id="error-container">
            <li class="error-response">
                <span class="response-key">
                Status Code:
                </span>
                <span class="response-value">
                {resp.statusCode}
                </span>
            </li>
            <li class="error-response">
                <span class="response-key">
                Status Text:
                </span>
                <span class="response-value">
                {resp.statusText}
                </span>
            </li>
            <li class="error-response">
                <span class="response-key">
                Error Message:
                </span>
                <span class="response-value">
                {resp.payload}
                </span>
            </li>
        </ul>
    );
}

// props.uuid contains the /{uuid} element
export default function Paste(props) {
    const [resp, setResp] = useState({});

    async function fetchPaste() {
        let url;
        if (process.env.NODE_ENV === "development") {
            url = "http://127.0.0.1:3000"
        } else {
            url = window.location.origin;
        }
        try {
            const response = await getPaste(url, props.uuid);
            if (response.content === undefined) {
                const text = await response.text();
                setResp({
                    statusCode: response.status,
                    statusText: response.statusText,
                    payload: text,
                });
                return
            }
            setResp(response);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(async () => {
        await fetchPaste();
    }, [props.uuid]);

    return (
        <div>
            { resp.content === undefined
                ? <ErrorMessage resp={resp} />
                : <Content resp={resp} />
            }
        </div>
    );
}
