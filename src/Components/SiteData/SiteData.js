import React, { Component } from 'react';
import { uploadFile, getSiteData } from "../../api/api";
import './SiteData.css'
import {Button} from "antd";
import {isNull} from "lodash";

class SiteData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            isUploading: false,
            existingFiles: []
        }
    }

    componentDidMount() {
        const existingData = getSiteData().data;
        this.setState({existingFiles: existingData});
        console.log(this.state.existingFiles)
    }

    onFileSelected = (event) => {
        this.setState({selectedFile: event.target.files[0]});
    }

    onFileUpload = () => {
        // Create an object of formData
        if (this.state.selectedFile != null) {
            const formData = new FormData();
            formData.append('file', this.state.selectedFile, this.state.selectedFile.name);

            this.setState({isUploading: true});
            uploadFile(formData).then((response) => {
                if (response && response.status === 200) {
                    this.setState({isUploading: false});
                    const existingData = getSiteData().data;
                    this.setState({existingFiles: existingData});
                    console.log(this.state.exis tingFiles);
                }
            });
        }
    }

    render () {
        return (
            <div className='site-data'>
                <h1 id='site-data-h1'>Manage Site Data files</h1>
                <hr />
                <h2 className='site-sata-h2'>Upload Site Data json file</h2>
                <div className='upload-section'>
                    <label for='select-file-btn'>Select a file: </label>
                    <input type="file" id='select-file-btn' onChange={this.onFileSelected} />
                    <Button loading={this.state.isUploading}
                            className='uploadBtn'
                            onClick={this.onFileUpload}
                            type="primary"
                            disabled={isNull(this.state.selectedFile)}
                    >
                        Upload file
                    </Button>
                </div>
                <div>
                    <h2 className='site-sata-h2'>Existing files</h2>
                    {

                    }
                </div>
            </div>
        );
    }
}

export default SiteData;