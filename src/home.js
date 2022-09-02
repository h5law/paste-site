import { useState } from 'preact/hooks';

const mapLangName = new Map([
    ["bash", "Bash"],
    ["c", "C"],
    ["cpp", "C++"],
    ["csharp", "C#"],
    ["css", "CSS"],
    ["diff", "Diff"],
    ["go", "Go"],
    ["graphql", "GraphQL"],
    ["ini", "INI"],
    ["java", "Java"],
    ["javascript", "JavaScript"],
    ["json", "JSON"],
    ["kotlin", "Kotlin"],
    ["less", "Less"],
    ["lua", "Lua"],
    ["makefile", "Makefile"],
    ["markdown", "Markdown"],
    ["objectivec", "Objective-C"],
    ["perl", "Perl"],
    ["php", "PHP"],
    ["php-template", "PHP Template"],
    ["plaintext", "Plaintext"],
    ["python", "Python"],
    ["python-repl", "Python REPL"],
    ["r", "R"],
    ["ruby", "Ruby"],
    ["rust", "Rust"],
    ["scss", "SCSS"],
    ["shell", "Shell"],
    ["sql", "SQL"],
    ["swift", "Swift"],
    ["typescript", "TypeScript"],
    ["wasm", "WebAssembly"],
    ["xml", "XML"],
    ["yaml", "YAML"],
    ["vbnet", ".NET"],
]);

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
        </div>
    );
}

export default function Home() {
    const [filetype, setFiletype] = useState("plaintext");
    const [expiresIn, setExpiresIn] = useState(14);

    return (
        <div id="container">
            <FtSelector sft={setFiletype} />
            <p>{filetype}</p>
            <ExpiresIn ei={expiresIn} sei={setExpiresIn} />
            <p>{expiresIn} day{expiresIn > 1 ? "s" : ""}</p>
        </div>
    );
}
