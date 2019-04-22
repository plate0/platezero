import React, { useState, useEffect } from 'react'
import * as _ from 'lodash'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from 'reactstrap'
import { Dropzone } from './Dropzone'
import { AlertErrors } from './AlertErrors'
import { api, getErrorMessages } from '../common'

interface Props {
  src: string
  onUpdate?: (url: string) => any
  canEdit?: boolean
  children: any
}

export const EditableImage = ({ src, canEdit, onUpdate, children }: Props) => {
  const [open, setOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)

  // clear any previous errors/uploaded image when the dialog is opened
  useEffect(() => {
    if (open) {
      setErrors(null)
      setUploadedImage(null)
    }
  }, [open])

  const toggle = () => setOpen(!open)

  const choose = () => {
    if (_.isFunction(onUpdate)) {
      onUpdate(uploadedImage || null)
    }
    setOpen(false)
  }

  const onDrop = async (files: File[]) => {
    setUploading(true)
    setErrors(null)
    const file = _.head(files)
    if (!file) {
      return
    }
    const form = new FormData()
    form.append('file', file, file.name)
    try {
      const { url } = await api.uploadPublicImage(form)
      setUploadedImage(url)
    } catch (err) {
      setErrors(getErrorMessages(err))
    } finally {
      setUploading(false)
    }
  }

  if (!_.isUndefined(canEdit) && !canEdit) {
    return children
  }

  return (
    <div className="mb-3">
      {src ? (
        <>
          {children}
          <div className="text-right">
            <Button
              color="link"
              className="text-secondary pr-0"
              size="sm"
              onClick={toggle}
            >
              <i className="fal fa-pencil" /> Edit Image
            </Button>
          </div>
        </>
      ) : (
        <div className="bg-light text-center">
          <Button
            color="link"
            className="text-secondary p-3"
            size="sm"
            onClick={toggle}
          >
            <i className="fal fa-cloud-upload" /> Add Image
          </Button>
        </div>
      )}
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>Choose Image</ModalHeader>
        <ModalBody>
          {isUploading ? (
            <div className="p-5 text-center">
              <Spinner color="secondary">Uploading...</Spinner>
            </div>
          ) : (
            <Dropzone onDrop={onDrop}>
              <p className="text-secondary">Drag and drop an image here, or</p>
              <Button color="primary">Choose a file from your device</Button>
            </Dropzone>
          )}
          <AlertErrors errors={errors} className="mt-3 mb-0 small" />
          {uploadedImage && (
            <div className="mt-3">
              <p className="text-secondary small">Preview:</p>
              <img
                src={uploadedImage}
                alt="Preview of uploaded image"
                className="w-100"
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="link" className="text-secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" outline onClick={choose}>
            {src && uploadedImage && 'Update Image'}
            {src && !uploadedImage && 'Remove Existing Image'}
            {!src && uploadedImage && 'Save New Image'}
            {!src && !uploadedImage && 'Keep Using No Image'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
