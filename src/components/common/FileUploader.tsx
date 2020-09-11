import React, { Component, Fragment } from 'react';
import Dropzone from 'react-dropzone';
import './FileUploader.scss';
import { ReactComponent as ReuploadBtnSvg } from '../../img/reupload-btn.svg';
import { ReactComponent as ReuploadSmSvg } from '../../img/reupload-sm.svg';
import { ReactComponent as FileUploadProfileSvg } from '../../img/file-upload-profile.svg';
import { ReactComponent as UploadSvg } from '../../img/upload-drop.svg';
import StringUtil from '../../util/StringUtil';
import CryptoUtil from '../../util/CryptoUtil';
import ZipUtil from '../../util/ZipUtil';
import { files } from 'jszip';

interface FileUploaderState {
  files: File[];
}

export enum FileUploaderThemeEnum {
  Basic = 'BASIC',
  Profile = 'PROFILE',
}

interface FileUploaderProps {
  setFile: (file?: File, thumbnailFile?: File, previewURL?: string) => void;
  documentType?: string;
  privateEncryptionKey?: string;
  theme: FileUploaderThemeEnum;
}

class FileUploader extends Component<FileUploaderProps, FileUploaderState> {
  static defaultProps = {
    theme: FileUploaderThemeEnum.Basic,
  };

  constructor(props: Readonly<FileUploaderProps>) {
    super(props);

    this.state = {
      files: [],
    };
  }

  reuploadFiles = () => {
    const { setFile } = { ...this.props };
    setFile(undefined);
    this.setState({ files: [] });
  };

  handleOnDrop = async (acceptedFiles: File[]) => {
    const { setFile, privateEncryptionKey } = { ...this.props };
    acceptedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    const [oneFile] = [...acceptedFiles];
    if (privateEncryptionKey) {
      const base64String = await StringUtil.fileContentsToString(oneFile);
      const base64Thumbnail = await StringUtil.fileContentsToThumbnail(oneFile);
      const encryptedString = await CryptoUtil.getEncryptedString(
        privateEncryptionKey!,
        base64String
      );
      const encryptedThumbnail = await CryptoUtil.getEncryptedString(
        privateEncryptionKey!,
        base64Thumbnail
      );
      const zipped: Blob = await ZipUtil.zip(encryptedString);
      const zippedThumbnail: Blob = await ZipUtil.zip(encryptedThumbnail);
      const newZippedFile = new File([zipped], 'encrypted-image.zip', {
        type: 'application/zip',
        lastModified: Date.now(),
      });
      const newZippedThumbnailFile = new File(
        [zippedThumbnail],
        'encrypted-image-thumbnail.zip',
        {
          type: 'application/zip',
          lastModified: Date.now(),
        }
      );
      setFile(newZippedFile, newZippedThumbnailFile, (oneFile as any).preview);
    } else {
      const base64Thumbnail = await StringUtil.fileContentsToThumbnail(
        oneFile,
        'blob'
      );
      const thumbnailFile = new File([base64Thumbnail], 'thumbnail.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      setFile(oneFile, thumbnailFile, (oneFile as any).preview);
    }
    this.setState({ files: acceptedFiles });
  };

  renderFiles(files: File[]) {
    const { documentType } = { ...this.props };
    if (files.length > 0) {
      const [oneFile] = [...files];
      return (
        <div className="file-preview">
          {/*{(oneFile as any).path} - {oneFile.size} bytes*/}
          <div className="file-image">
            <img
              className={'document-summary-image'}
              src={(oneFile as any).preview}
              alt={''}
            />
          </div>
          <div className="file-info">
            <div className="file-info-items">
              <div className="file-info-item">
                <div className="file-info-title">FILE NAME</div>
                <div>{(oneFile as any).path}</div>
              </div>
              {documentType && (
                <div className="file-info-item">
                  <div className="file-info-title">DOCUMENT NAME</div>
                  <div>{documentType}</div>
                </div>
              )}
            </div>
            <div className="file-reupload">
              <div>Not the right file?</div>
              <ReuploadBtnSvg
                style={{ cursor: 'pointer' }}
                onClick={this.reuploadFiles}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return <Fragment />;
    }
  }

  renderForm(getRootProps: any, getInputProps: any) {
    const { theme } = { ...this.props };
    return (
      <div {...getRootProps()} className="dropzone-form">
        <input {...getInputProps()} />
        {theme === FileUploaderThemeEnum.Basic && (
          <Fragment>
            <div className="upload-sm">
              <ReuploadSmSvg />
            </div>
            <div className="upload">
              <div className="caption">
                Upload your file by dropping it here...
              </div>
              <UploadSvg />
            </div>
          </Fragment>
        )}
        {theme === FileUploaderThemeEnum.Profile && (
          <div className="upload-profile">
            <FileUploadProfileSvg />
          </div>
        )}
      </div>
    );
  }

  render() {
    const { files } = { ...this.state };

    return (
      <Dropzone onDrop={this.handleOnDrop}>
        {({ getRootProps, getInputProps }) => (
          <section className="dropzone-container">
            {files.length <= 0 && this.renderForm(getRootProps, getInputProps)}
            {files.length > 0 && this.renderFiles(files)}
          </section>
        )}
      </Dropzone>
    );
  }
}

export default FileUploader;
