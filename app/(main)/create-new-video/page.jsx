"use client"
import React, { useState } from 'react'
import Topic from './_components/Topic'

function CreateNewVideo() {

    const [formData, setFormData] = useState();

    const onHandleInputChanges=(fieldName,fieldValue)=>{
        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))
    }

  return (
    <div>
        <h2 className='text-3xl'>Create New Video</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 mt-8'>
            <div className='col-span-2 p-7 border rounded-xl'>

                 {/* {Topic & Script} */}
        <Topic/>
        {/* {Video Image Style} */}

        {/* {Voice} */}

        {/* {Captions} */}
                
            </div>
            <div>

            </div>
        </div>
       
    </div>
  )
}

export default CreateNewVideo