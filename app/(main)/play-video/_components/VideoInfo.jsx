import { ArrowLeft } from 'lucide-react'
import React from 'react'

function VideoInfo({videoData}) {
  console.log("alwis",videoData)
  return (
    <div>
      <h2 className='flex gap-2 items-center'>
        <ArrowLeft/>
        Back To The Dashboard
      </h2>
      <h2 className='mt-5'>
        Project Name : {videoData?.title}
      </h2>
      <p className='text-gray-500'>Script : {videoData.script} </p>
    </div>
  )
}

export default VideoInfo