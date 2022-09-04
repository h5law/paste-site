import { useState, useEffect } from 'preact/hooks';

import { getPaste, updatePaste, deletePaste } from './api.js';
import { mapLangName } from './utils.js'

function EditOptions(props) {
    function handleSelChange(e) {
      e.preventDefault();
      props.sft(e.target.value);
    }

    function handleSliChange(e) {
        e.preventDefault();
        props.sei(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault()
        props.ses((prev) => !prev)
    }

    return (
        <div id="button-container">
            <div id="ft-selector-container">
                <label for="ft-select">Filetype: </label>
                <select name="ft" id="ft-select" onChange={handleSelChange}
                        disabled={!props.es}>
                    ${Array.from(mapLangName).map(m => {
                      if (m[0] === props.ft) {
                        return <option value={m[0]} selected>{m[1]}</option>
                      } else {
                        return <option value={m[0]}>{m[1]}</option>
                      }
                    })}
                </select>
            </div>
            <div id="ei-number-container">
                <label for="ei-number">Expires In: </label>
                <input type="range" id="ei-number" name="expires-in"
                       min="1" max="30" value={props.ei} onChange={handleSliChange}
                       disabled={!props.es} />
                <p><span id="days-label">
                    {props.ei} day{props.ei > 1 ? "s" : ""}
                </span></p>
            </div>
            <div id="edit-container">
                <button id="edit-button" onClick={handleSubmit}>
                    { !props.es ? "Edit Paste" : "Disable Edit" }
                </button>
            </div>
        </div>
    );
}

function PasteMeta(props) {
    const [action, setAction] = useState("update");

    function handleChange(e) {
        e.preventDefault();
        props.sak(e.target.value);
    }

    function handleSelChange(e) {
        e.preventDefault();
        setAction(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (props.ak.length === 25) {
            if (action === "update") {
                await props.up();
            } else if (action === "delete") {
                await props.del();
            }
        }
    }

    return (
        <div id="paste-meta-container">
            <p>Filetype: <span class="meta-wrapper">{mapLangName.get(props.ft)}</span></p>
            <p>Expires At: <span class="meta-wrapper">{props.ea}</span></p>
            <div id="edit-container">
                <select id="change-delete-selector" onChange={handleSelChange}>
                    <option value="update" selected>Update</option>
                    <option value="delete">Delete</option>
                </select>
                <input type="text" id="accesskey-input" name="accesskey"
                       placeholder="Enter Paste Access Key" value={props.ak}
                       maxlength="25" onChange={handleChange}
                />
                <button id="submit-changes-button"
                        disabled={props.ak < 25} onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

function Content(props) {
    const textAreaStyle = {
        width: `99%`,
        maxHeight: `99%`,
    };

    const languageStr = `language-${props.ft}`;

    function handleChange(e) {
        e.preventDefault();
        props.sco(e.target.value.split("\n"));
    }

    return (
        <pre id="code-container">
            <code class={languageStr}>
                <textarea id="code" name="paste-code" disabled={!props.es} rows="30"
                          style={textAreaStyle} value={props.co.join("\n")}
                          onChange={handleChange}>
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

    if (resp.content === undefined && Object.keys(resp).length > 0) {
        return (
            <div>
                <ErrorMessage resp={resp} />
            </div>
        );
    } else if (resp.content && Object.keys(resp).length > 0) {
        const [editState, setEditState] = useState(false);
        const [content, setContent] = useState(resp.content);
        const [filetype, setFiletype] = useState(resp.filetype);
        const [expiresIn, setExpiresIn] = useState(14);
        const [accessKey, setAccessKey] = useState("");
        const [err, setErr] = useState({});

        async function editPaste() {
            let url;
            if (process.env.NODE_ENV === "development") {
                url = "http://127.0.0.1:3000"
            } else {
                url = window.location.origin;
            }
            try {
                let co, ft = null;
                if (content.join("") !== resp.content.join("")) {
                    co = content;
                }
                if (filetype !== resp.filetype) {
                    ft = filetype;
                }
                const response = await updatePaste(url, props.uuid, co, ft, expiresIn, accessKey);
                if (response.expiresAt === undefined) {
                    const text = await response.text();
                    setErr({
                        statusCode: response.status,
                        statusText: response.statusText,
                        payload: text,
                    });
                    return
                }
                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }

        async function delPaste() {
            let url;
            if (process.env.NODE_ENV === "development") {
                url = "http://127.0.0.1:3000"
            } else {
                url = window.location.origin;
            }
            try {
                const response = await deletePaste(url, props.uuid, accessKey);
                if (response === undefined) {
                    const text = await response.text();
                    setErr({
                        statusCode: response.status,
                        statusText: response.statusText,
                        payload: text,
                    });
                    return
                }
                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }

        return (
            <div>
                <EditOptions ft={filetype} sft={setFiletype} ei={expiresIn}
                             sei={setExpiresIn} es={editState} ses={setEditState}
                />
                <Content co={content} sco={setContent} ft={filetype} es={editState} />
                <PasteMeta ft={resp.filetype} ea={resp.expiresAt}
                           ak={accessKey} sak={setAccessKey} up={editPaste}
                           del={delPaste}
                />
                { Object.keys(err).length > 0
                    ? <div id="error-wrapper"><ErrorMessage resp={err} /></div>
                    : "" }
            </div>
        );
    }
}
