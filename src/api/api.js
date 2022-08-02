import axios from 'axios';

const baseUrl = 'http://localhost:9997/api'

export async function uploadFile(formData) {
    const path = `${baseUrl}/site-data`;
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            'accept': "*/*",
            'Access-Control-Allow-Origin': "*"
        }
    };

    return await axios.post(path, formData, config);
}

export async function getSiteData() {
    const path = `${baseUrl}/site-data`
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });

    return await response.json();
}