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
