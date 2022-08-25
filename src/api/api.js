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

async function baseRequest(url, method, headers, data) {
    const response = await fetch(url, {
        method: method,
        headers,
        body: data
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

export async function getSiteData() {
    const url = `${baseUrl}/site-data`;
    const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'GET', headers);
    return result;
}

export async function deleteFile(fileId) {
    const url = `${baseUrl}/site-data/${fileId}`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'DELETE', headers);
    return result;
}

export async function createProblem(fileId, title) {
    const url = `${baseUrl}/problem`;
    const data = {
        'site_data_id': fileId,
        'title': title
    }

    console.log(data)
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'POST', headers, JSON.stringify(data));
    return result;
}

export async function getSolutionByProblemId(problemId) {
    const url = `${baseUrl}/problem/${problemId}/solution`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'GET', headers);
    return result;
}

export async function getProblemById(problemId) {
    const url = `${baseUrl}/problems/${problemId}`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'GET', headers);
    return result;
}

export async function getSiteDataById(siteDataId) {
    const url = `${baseUrl}/site-data`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const sitesData = await baseRequest(url, 'GET', headers);
    const result = sitesData.list.find((s) => s.id = siteDataId)
    return result;
}

export async function getSavedSolutions() {
    const url = `${baseUrl}/favorite-solution`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'GET', headers);
    return result;
}

export async function getSolutionById(solutionId) {
    const url = `${baseUrl}/favorite-solution/${solutionId}`;
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    };

    const result = await baseRequest(url, 'GET', headers);
    return result;
}