import React, { useEffect } from 'react'
import { useVideoConfig } from 'remotion';

function RemotionComposition({videoData,setDurationInFrame}) {
    const captions=videoData?.cationJson;
    const {fps}=useVideoConfig();

    useEffect(() => {
      videoData && getDurationFrame();
    },[videoData])

    const getDurationFrame=()=>{
      const totalDuration=captions[captions?.length-1]?.end * fps;
      setDurationInFrame(totalDuration);
    }

  return (
    <div>RemotionComposition</div>
  )
}

export default RemotionComposition