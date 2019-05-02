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
  hasExisting: boolean
  onUpdate?: (url: string) => any
}

export const EditableImage = ({ hasExisting, onUpdate }: Props) => {
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

  return (
    <div className="mb-3">
      <div className="text-center">
        <Button
          color="link"
          className="text-secondary"
          size="sm"
          onClick={toggle}
        >
          <i className="fal fa-pencil" /> Edit Image
        </Button>
      </div>
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
            {hasExisting && uploadedImage && 'Update Image'}
            {hasExisting && !uploadedImage && 'Remove Existing Image'}
            {!hasExisting && uploadedImage && 'Save New Image'}
            {!hasExisting && !uploadedImage && 'Keep Using No Image'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
