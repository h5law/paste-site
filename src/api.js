export async function createPaste(url, content, filetype, expiresIn) {
    const endpoint = url.replace(/\/$/, '') + "/api/new";
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                "content": content,
                "filetype": filetype,
                "expiresIn": expiresIn,
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
