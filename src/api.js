export async function createPaste(url, content, filetype, expiresIn) {
    const endpoint = url.replace(/\/$/, '') + "/api/new";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                "content": content,
                "filetype": filetype,
                "expiresIn": Number(expiresIn),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse
        }
        return response
    } catch (err) {
        throw err
    }
}

export async function getPaste(url, uuid) {
    const endpoint = url.replace(/\/$/, '') + "/api/" + uuid;
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse
        }
        return response
    } catch (err) {
        throw err;
    }
}

export async function updatePaste(url, uuid, content, filetype, expiresIn, accessKey) {
    const endpoint = url.replace(/\/$/, '') + "/api/" + uuid;
    const bodyObj = {};
    if (content !== null) {
        bodyObj["content"] = content;
    }
    if (filetype !== null) {
        bodyObj["filetype"] = filetype;
    }
    if (expiresIn !== 0) {
        bodyObj["expiresIn"] = Number(expiresIn);
    }
    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            body: JSON.stringify({
                ...bodyObj,
                "accessKey": accessKey,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse
        }
        return response
    } catch (err) {
        throw err
    }
}

export async function deletePaste(url, uuid, accessKey) {
    const endpoint = url.replace(/\/$/, '') + "/api/" + uuid;
    try {
        const response = await fetch(endpoint, {
            method: "DELETE",
            body: JSON.stringify({
                "accessKey": accessKey,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response
    } catch (err) {
        throw err
    }
}
