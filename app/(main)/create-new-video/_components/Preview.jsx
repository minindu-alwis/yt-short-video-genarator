import Image from 'next/image';
import React from 'react';
import { options } from './VideoStyle';

function Preview({ formData }) {
    console.log("Preview Form Data", formData);
  const selectVideoStyle = formData && options.find(
    item => item.name === formData?.videoStyle
  );

  return (
    <div className='relative'>
        <h2 className='mb-3 text-2xl'>Preview</h2>
      {selectVideoStyle?.image ? (
        <Image 
          src={selectVideoStyle.image} 
          alt={selectVideoStyle.name || 'Selected video style'} 
          width={1000} 
          height={300} 
          className='w-full h-[70vh] object-cover rounded-xl'
        />
      ) : (
        <p>No video style selected or image unavailable.</p>
      )}
      <h2 className={`${formData?.caption?.style} absolute bottom-8 text-center w-full `}>{formData?.caption?.name}</h2>
    </div>
  );
}

export default Preview;
