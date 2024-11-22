/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCallback } from 'react';
import { ImageType } from '../admin/add-products/AddProductForm';
import { useDropzone } from 'react-dropzone';

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}

const SelectImage: React.FC<SelectImageProps> = ({ item, handleFileChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'] },
  });
  return (
    <div
      {...getRootProps()}
      className="border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 items-center justify-center">
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the image here ...</p> : <p>+ {item?.color} Image</p>}
    </div>
  );
};

export default SelectImage;
