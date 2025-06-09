import React, { useEffect, useMemo } from 'react'
import { AbsoluteFill, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionComposition({ videoData, setDurationInFrame }) {
    const captions = videoData?.captionJson;
    const { fps } = useVideoConfig();
    const imageList = videoData?.images;
    const frame = useCurrentFrame();

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
                const scale = (index) => interpolate(
                    frame,
                    [startTime, startTime + totalDuration * 0.3, startTime + totalDuration * 0.7, startTime + totalDuration],
                    index % 2 == 0 ? [1, 1.2, 0.95, 1] : [1, 0.8, 1.15, 1],
                    {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                    }
                )

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
                                    transform: `scale(${scale(index)})`,
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