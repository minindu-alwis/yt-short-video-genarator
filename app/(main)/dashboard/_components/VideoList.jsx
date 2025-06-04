"use client";
import { useAuthContext } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { RefreshCcw } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function VideoList() {
    const [videoList, setVideoList] = useState([]);
    const convex = useConvex();
    const {user} = useAuthContext();
    
const getUserVideoList = async () => {
    const result = await convex.query(api.videoData.GetUserVideos, {
        uid: user?._id
    });
    setVideoList(result);
    const isPendingVideo = result?.find((video) => video.status === 'pending' || video.status === '');
    if (isPendingVideo) {
        GetPendingVideoStatus(isPendingVideo);
    }
    console.log("result", result);
}

let intervalId = null; // Store interval at module level

const GetPendingVideoStatus = (pendingVideo) => {
    // Clear any existing interval first
    if (intervalId) {
        clearInterval(intervalId);
    }
    
    intervalId = setInterval(async () => {
        const result = await convex.query(api.videoData.GetVideoById, {
            videoId: pendingVideo?._id
        });
        
        if (result?.status === 'completed') {
            clearInterval(intervalId);
            intervalId = null;
            console.log("video completed");
            await getUserVideoList();
        }
        console.log("Still Pending...");
    }, 5000);
}

useEffect(() => {
    user && getUserVideoList();
    
    // Cleanup interval on unmount
    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
}, [user]);

    return (
        <div>
            {videoList?.length === 0 ? (
                <div  className='flex flex-col items-center justify-center mt-28 gap-5 p-5 border-dashed rounded-xl py-16'>
                    <Image src={'/logo.svg'} alt='logo' width={150} height={150}/>
                    <h2 className='text-gray-400 text-lg'>You Dont Have Any Video Created !</h2>
                    <Link href={'/create-new-video'}>
                        <Button>+ Create New Video</Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-2 lg:grid-cols-3 xl-grid-cols-5 gap-5 mt-10'>
                    {videoList?.map((video, index) => (
                        <div key={index}> {/* Added key prop here */}
                           {video?.status=='completed'? <Image 
                                src={video?.images[0]}
                                alt={video?.title}
                                width={500}
                                height={500}
                                className='w-full object-cover rounded-xl aspect-[2/3]'
                            />:
                            <div className='aspect-[2/3] w-full p-5 rounded-xl bg-slate-700 flex items-center justify-center flex-col gap-5'>
                                <RefreshCcw className='animate-spin'/>
                                <h2>Genarating.....</h2>
                                </div>}
                            <div className='items-center justify-between flex flex-col mt-2'>
                                <h2>{video?.title}</h2>
                                <h2>{moment(video?._creationTime).fromNow()}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VideoList