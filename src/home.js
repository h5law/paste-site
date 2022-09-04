import { useState, useRef } from 'preact/hooks';

import { createPaste } from './api.js'
import { mapLangName } from './utils.js'

function FtSelector(props) {
    function handleChange(e) {
      e.preventDefault();
      props.sft(e.target.value);
    }

    return (
        <div id="ft-selector-container">
            <label for="ft-select">Filetype: </label>
            <select name="ft" id="ft-select" onChange={handleChange}>
                ${Array.from(mapLangName).map(m => {
                  if (m[0] === "plaintext") {
                    return <option value={m[0]} selected>{m[1]}</option>
                  } else {
                    return <option value={m[0]}>{m[1]}</option>
                  }
                })}
            </select>
        </div>
    );
}

function ExpiresIn(props) {
    function handleChange(e) {
        e.preventDefault();
        props.sei(e.target.value);
    }

    return (
        <div id="ei-number-container">
            <label for="ei-number">Expires In: </label>
            <input type="range" id="ei-number" name="expires-in"
                   min="1" max="30" value={props.ei} onChange={handleChange} />
            <p><span id="days-label">
                {props.ei} day{props.ei > 1 ? "s" : ""}
            </span></p>
        </div>
    );
}

function CreateButton(props) {
    async function handleSubmit(e) {
        e.preventDefault()
        if (props.co.length > 0) {
            await props.np()
        }
    }

    return (
        <div id="create-container">
            <button id="create-button"
                disabled={props.co.length < 1} onClick={handleSubmit}>
                Create Paste
            </button>
        </div>
    );
}

function PasteCode(props) {
    const codeAreaRef = useRef();
    const [content, setContent] = useState("");

    const textAreaStyle = {
        width: `99%`,
        maxHeight: `99%`,
    };

    function handleChange(e) {
        if (e.target.value !== "") {
            props.sc(e.target.value.split('\n'));
        } else {
            props.sc([])
        }
        setContent(e.target.value);
    }

    function handleTab(e) {
        // indent 4 spaces
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            const value = codeAreaRef.current.value;
            const selectionStart = codeAreaRef.current.selectionStart;
            const selectionEnd = codeAreaRef.current.selectionEnd;
            codeAreaRef.current.value =
                value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
                codeAreaRef.current.selectionStart = selectionEnd + 4 - (selectionEnd - selectionStart);
                codeAreaRef.current.selectionEnd = selectionEnd + 4 - (selectionEnd - selectionStart);
        }

        // indent backwards
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            const value = codeAreaRef.current.value;
            const selectionStart = codeAreaRef.current.selectionStart;
            const selectionEnd = codeAreaRef.current.selectionEnd;

            const beforeStart = value
                .substring(0, selectionStart)
                .split('')
                .reverse()
                .join('');
            const indexOfTab = beforeStart.indexOf("    ");
            const indexOfNewline = beforeStart.indexOf('\n');

            if (indexOfTab !== -1 && indexOfTab < indexOfNewline) {
                codeAreaRef.current.value =
                    beforeStart
                        .substring(indexOfTab + 4)
                        .split('')
                        .reverse()
                        .join('') +
                    beforeStart
                        .substring(0, indexOfTab)
                        .split('')
                        .reverse()
                        .join('') +
                    value.substring(selectionEnd);

                codeAreaRef.current.selectionStart = selectionStart - 4;
                codeAreaRef.current.selectionEnd = selectionEnd - 4;
            }
        }
    }

    const languageStr = `language-${props.ft}`;

    return (
        <pre id="code-container">
            <code class={languageStr}>
                <textarea id="code" name="paste-code" autofocus rows="30"
                          style={textAreaStyle} ref={codeAreaRef}
                          onChange={handleChange} onKeyDown={handleTab}>
                </textarea>
            </code>
        </pre>
    );
}

function ResponseText({ resp }) {
    if (resp.statusCode !== undefined) {
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
    } else if (Object.keys(resp).length > 0){
        return (
            <ul id="success-container">
                <li class="success-response">
                    <span class="response-key">
                    UUID:
                    </span>
                    <span class="response-value">
                    <a href={window.location.href+resp.uuid}>{resp.uuid}</a>
                    &nbsp;<a href={window.location.href+resp.uuid+"/raw"}>(raw)</a>
                    </span>
                </li>
                <li class="success-response">
                    <span class="response-key">
                    Access Key:
                    </span>
                    <span class="response-value">
                    {resp.accessKey}
                    </span>
                </li>
                <li class="success-response">
                    <span class="response-key">
                    Expires At:
                    </span>
                    <span class="response-value">
                    {resp.expiresAt}
                    </span>
                </li>
            </ul>
        );
    }
}

export default function Home() {
    const [filetype, setFiletype] = useState("plaintext");
    const [expiresIn, setExpiresIn] = useState(14);
    const [content, setContent] = useState([]);
    const [resp, setResp] = useState({});

    async function newPaste() {
        let url;
        if (process.env.NODE_ENV === "development") {
            url = "http://127.0.0.1:3000"
        } else {
            url = window.location.origin;
        }
        try {
            const response = await createPaste(url, content, filetype, expiresIn);
            if (response.accessKey === undefined) {
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

    return (
        <div>
            <div id="button-container">
                <FtSelector sft={setFiletype} />
                <ExpiresIn ei={expiresIn} sei={setExpiresIn} />
                <CreateButton co={content} np={newPaste} />
            </div>
            <PasteCode ft={filetype} co={content} sc={setContent} />
            <ResponseText resp={resp} />
        </div>
    );
}
