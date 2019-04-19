import React, { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from 'reactstrap'

const baseStyle = {
  width: '100%',
  height: 200,
  backgroundColor: '#f8f9fa',
  //border: '1px solid #dee2e6',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#dee2e6',
  borderRadius: '0.25rem',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column' as any
}

const activeStyle = {
  borderColor: '#19afd0',
  boxShadow: '0 0 0 0.2rem rgba(60, 187, 215, 0.5)'
}

const acceptStyle = {
  borderStyle: 'solid',
  borderColor: '#00e676'
}

export const Dropzone = ({ onDrop }: { onDrop: Function }) => {
  const cb = useCallback(files => {
    onDrop(files)
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept
  } = useDropzone({ onDrop: cb, multiple: true })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {})
    }),
    [isDragActive]
  )

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} className="bg-light" />
      <div className="text-center font-weight-bold">
        Drag and drop any files here.
      </div>
      <div style={{ lineHeight: '3rem' }}>OR</div>
      <Button color="primary">Browse to find files</Button>
    </div>
  )
}
