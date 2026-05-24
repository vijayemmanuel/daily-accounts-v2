export async function get (url : string) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
}

export async function put(url: string, body:string) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error("Failed to update data");
    }

    const data = await response.json();
    return data;
}