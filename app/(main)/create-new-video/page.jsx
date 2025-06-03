"use client"
import React, { useState } from 'react'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle';
import Voice from './_components/Voice';
import Captions from './_components/Captions';
import { Button } from '@/components/ui/button';
import { Loader2Icon, WandSparkles } from 'lucide-react';
import Preview from './_components/Preview';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { useAuthContext } from '@/app/provider';
import { api } from '@/convex/_generated/api';

function CreateNewVideo() {

  const CreateInitialVideoRecord = useMutation(api.videoData.CreateVideoData);
  const { user } = useAuthContext();

  const [formData, setFormData] = useState();
  const [loading, setLoading] = useState(false);

  const onHandleInputChanges = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
    console.log("minidu", formData);
  };

  const GenarateVideo = async () => {
    if (
      !formData?.topic ||
      !formData?.script ||
      !formData?.videoStyle ||
      !formData?.voice ||
      !formData?.caption ||
      !formData?.title
    ) {
      console.log("ERROR", "Please Fill All Fields");
      return;
    }

    setLoading(true);

    try {
      // Save video to database
      const resp = await CreateInitialVideoRecord({
        title: formData.title,
        topic: formData.topic,
        script: formData.script,
        videoStyle: formData.videoStyle,
        caption: formData.caption,
        voice: formData.voice,
        uid: user?._id,
        createdBy: user?.email,
        credits:user?.credits
      });
      console.log("Genarate Video Result", resp);

      const result = await axios.post('api/genarate-video-data', {
        ...formData,
        recordId: resp,
      });
      console.log("Genarate Video Result", result);
    } catch (err) {
      console.error("Error generating video:", err);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className='text-3xl'>Create New Video</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-7'>
        <div className='col-span-2 p-7 border rounded-xl h-[75vh] overflow-auto'>

          {/* {Topic & Script} */}
          <Topic onHandleInputChanges={onHandleInputChanges} />
          {/* {Video Image Style} */}
          <VideoStyle onHandleInputChanges={onHandleInputChanges} />
          {/* {Voice} */}
          <Voice onHandleInputChanges={onHandleInputChanges} />
          {/* {Captions} */}
          <Captions onHandleInputChanges={onHandleInputChanges} />

          <Button className='w-full mt-5 cursor-pointer' onClick={GenarateVideo}>
            {loading ? <Loader2Icon className='animate-spin' /> : <WandSparkles />} Genarate Video
          </Button>
        </div>
        <div>
          <Preview formData={formData} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewVideo;
