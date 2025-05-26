"use client"
import React, { useState } from 'react'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle';
import Voice from './_components/Voice';
import Captions from './_components/Captions';

function CreateNewVideo() {

    const [formData, setFormData] = useState();

    const onHandleInputChanges=(fieldName,fieldValue)=>{
        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))
        console.log("minidu",formData);
    }

  return (
    <div>
        <h2 className='text-3xl'>Create New Video</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 mt-8'>
            <div className='col-span-2 p-7 border rounded-xl h-[75vh] overflow-auto'>

                 {/* {Topic & Script} */}
        <Topic onHandleInputChanges={onHandleInputChanges}/>
        {/* {Video Image Style} */}
        <VideoStyle onHandleInputChanges={onHandleInputChanges}/>
        {/* {Voice} */}
        <Voice  onHandleInputChanges={onHandleInputChanges}/>
        {/* {Captions} */}
        <Captions onHandleInputChanges={onHandleInputChanges}/>
                
            </div>
            <div>

            </div>
        </div>
       
    </div>
  )
}

export default CreateNewVideo