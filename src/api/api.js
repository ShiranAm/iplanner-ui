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
    const url = `${baseUrl}/site-data`
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        }
    });
    const { status, statusText } = response;
    const resJson = await response.json();
    let result = {};
    if (status === 200) {
        if (resJson instanceof Array) {
            result = {
                success: true,
                message: statusText,
                statusCode: status,
                list: resJson
            };
        } else if (typeof resJson === 'string') {
            result = {
                success: true,
                message: statusText,
                statusCode: status,
                stringResult: resJson
            };
        } else {
            result = {
                success: true,
                message: statusText,
                statusCode: status,
                ...resJson
            }
        }
    } else {
        result = {
            success: false,
            message: resJson.message,
            statusCode: status
        }
    }

    return result;
}