import React, { useEffect } from 'react'
import { AbsoluteFill, Img, Sequence, useVideoConfig } from 'remotion';

function RemotionComposition({videoData,setDurationInFrame}) {
    
    const captions=videoData?.cationJson;
    const {fps}=useVideoConfig();
    const imageList=videoData?.images;
    console.log("videoData",videoData);
    console.log("captions",captions);
    console.log("imageList",imageList);
    

    useEffect(() => {
      videoData && getDurationFrame();
    },[videoData])

    const getDurationFrame=()=>{
      const totalDuration=captions[captions?.length-1]?.end * fps;
      setDurationInFrame(totalDuration);
      return totalDuration;
    }

  return (
    <div>
      <AbsoluteFill>


      {imageList?.map((item,index)=>{
        const startTime=(index*getDurationFrame())/imageList?.length;
        const duration=getDurationFrame();
        return(
          <>
          <Sequence key={index} from={startTime} durationInFrames={getDurationFrame()}>
            <AbsoluteFill>
              <Img
              src={item}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              />
            </AbsoluteFill>
          </Sequence>
          </>
        )
      })}
      </AbsoluteFill>
    </div>
  )
}

export default RemotionComposition