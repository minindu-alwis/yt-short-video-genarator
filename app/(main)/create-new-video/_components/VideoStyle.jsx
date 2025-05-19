import Image from 'next/image'
import React, { useState } from 'react'

const options=[
    {
        name:'Realistic',
        image:'/realistic.png'
    },
    {
        name:'Cinematic',
        image:'/cinamatic.png'
    },
    {
        name:'3D',
        image:'/3d.png'
    },
    {
        name:'Watercolor',
        image:'/watercolor.png'
    },
    {
        name:'Anim',
        image:'/anim.png'
    },
    {
        name:'Gta',
        image:'/gta.png'
    },
]
function VideoStyle({onHandleInputChanges}) {

    const [selectedStyle,setSelectedStyle]=useState();

  return (
    <div className='mt-5'>
        <h2>Video Style</h2>
        <p className='text-sm text-gray-400 mb-1'>Select Video Style</p>

        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2'>
            {options?.map((option,index)=>(
               <div className='relative'
               onClick={()=>{setSelectedStyle(option.name);
                onHandleInputChanges('imageStyle',option.name)
               }}
               >
                    <Image src={option.image}
                    alt={option.name}
                    width={500}
                    height={120}
                    className={`object-cover h-[70px] lg:h[130px]
                     xl:h-[180px] rounded-lg p-1 hover:border
                      border-gray-400 cursor-pointer
                       ${option.name == selectedStyle && 'border'}`}
                    />
                    <h2 className='absolute bottom-1 text-center w-full'>{option.name}</h2>
               </div>
            ))}
        </div>
    </div>
  )
}

export default VideoStyle