import React, { useEffect, useMemo } from 'react'
import { AbsoluteFill, Img, Sequence, useVideoConfig } from 'remotion';

function RemotionComposition({videoData, setDurationInFrame}) {
    const captions = videoData?.captionJson;
    const { fps } = useVideoConfig();
    const imageList = videoData?.images;

    // Calculate totalDuration without side effects
    const totalDuration = useMemo(() => {
        if (!captions || captions.length === 0) return 0;
        return captions[captions.length - 1].end * fps;
    }, [captions, fps]);

    // Set duration only once when calculated
    useEffect(() => {
        if (totalDuration > 0) {
            setDurationInFrame(totalDuration);
        }
    }, [totalDuration, setDurationInFrame]);

    return (
        <AbsoluteFill>
            {imageList?.map((item, index) => {
                const startTime = (index * totalDuration) / imageList.length;
                
                return (
                    <Sequence 
                        key={index} 
                        from={startTime} 
                        durationInFrames={totalDuration}
                    >
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
                );
            })}
        </AbsoluteFill>
    );
}

export default RemotionComposition;