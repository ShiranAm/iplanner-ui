import React, { useState, useEffect } from "react";
import { uploadFile, getSiteData, deleteFile } from "../../api/api";
import { Button, Input, Row, Col, Table } from "antd";
import { DeleteFilled } from '@ant-design/icons';
import {isNull} from "lodash";
import './SiteData.css'

function SiteData(props) {
    const [isUploading, setIsUploading] = useState(false);
    const [existingFiles, setExistingFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileTitle, setFileTitle] = useState("");

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: "30%"
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: "100%"
        },
        {
            title: 'Action',
            key: 'action',
            width: "20%",
            render: (data) => (<Button onClick={() => handleDeleteFile(data.id)}><DeleteFilled /></Button>)

        }
    ]

    useEffect(() => {
        const fetchData = async () => {
            const existingData = await getSiteData();
            if (existingData && existingData.statusCode === 200) {
                setExistingFiles(existingData.list);
            } else {
                setExistingFiles([]);
            }
        }

        fetchData();
    }, []);

    const onFileSelected = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const onFileTitleChange = (e) => {
        setFileTitle(e.target.value);
    }

    const handleDeleteFile = async (fileId) => {
        const response = await deleteFile(fileId);
        if (response && response.statusCode === 200) {
            setExistingFiles(response.list);
        }
    }

    const onFileUpload = () => {
        // Create an object of formData
        if (selectedFile != null) {
            const formData = new FormData();
            formData.append('file', selectedFile, selectedFile.name);
            formData.append('title', fileTitle);
            setIsUploading(true);
            uploadFile(formData).then(async (response) => {
                if (response && response.status === 200) {
                    setIsUploading(false);
                    const existingData = await getSiteData();
                    if (existingData && existingData.statusCode === 200) {
                        setExistingFiles(existingData.list);
                    }
                }
            });
        }
    }

    return (
        <div className='site-data'>
            <h1 id='site-data-h1'>Manage Site Data files</h1>
            <hr />
            <h2 className='site-sata-h2'>Upload Site Data json file</h2>
            <div className='upload-section'>
                <Row gutter={[16, 16]} justify='center'>
                    <Col>
                        <label style={{paddingLeft: "80px"}} htmlFor='select-file-btn'>Select a file: </label>
                        <input type="file" id='select-file-btn' onChange={onFileSelected}/>
                    </Col>
                    <Col span={24}>
                        <Input
                          value={fileTitle}
                          onChange={onFileTitleChange}
                          placeholder='Title your file'
                          style={{width: "200px", marginLeft: "10px", marginRight: "10px"}}
                        >

                        </Input>
                        <Button loading={isUploading}
                                className='uploadBtn'
                                onClick={onFileUpload}
                                type="primary"
                                disabled={isNull(selectedFile)}
                        >
                            Upload file
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className='tableContainer'>
                <h2 className='site-sata-h2'>Existing files</h2>
                    <div style={{width: "700px", textAlign: '-webkit-center'}}>
                        <Table
                          columns={columns}
                          dataSource={existingFiles}
                        >
                        </Table>
                    </div>
            </div>
        </div>
    );
}

export default SiteData;
