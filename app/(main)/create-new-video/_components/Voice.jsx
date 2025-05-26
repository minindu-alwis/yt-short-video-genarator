import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState } from 'react';



const voiceOptions = [
    {
        "value": 'af_sarah',
        "name": '🎉 Sarah (Female)'
    },
    {
        "value": 'af_sky',
        "name": '🎀 Sky (Female)'
    },
    {
        "value": 'am_adam',
        "name": '🎈 Adam (Mail)'
    },
    {
        "value": 'hf_alpha',
        "name": '🎨 Alpha (Female)'
    },
    ,
    {
        "value": 'af_sky',
        "name": '🎀 Sky (Female)'
    },
    {
        "value": 'am_adam',
        "name": '🎈 Adam (Mail)'
    },
    {
        "value": 'hf_alpha',
        "name": '🎨 Alpha (Female)'
    }
    ,
    {
        "value": 'af_sky',
        "name": '🎀 Sky (Female)'
    },
    {
        "value": 'am_adam',
        "name": '🎈 Adam (Mail)'
    },
    {
        "value": 'hf_alpha',
        "name": '🎨 Alpha (Female)'
    }

]

function Voice({onHandleInputChanges}) {

    const [selectedVoice, setSelectedVoice] = useState();

    return (
        <div className='mt-5'>
            <h2>Video Voice</h2>
            <p className='text-sm text-gray-400'>Select Voice For Your Video</p>

            <ScrollArea className='h-[200px] w-full p-4'>

            <div className='grid grid-cols-2 gap-3'>
                {voiceOptions.map((voice, index) => (
                    
                        <h2 className={`cursor-pointer p-1 dark:bg-slate-900 dark:border-white 
                            rounded-lg hover:border ${voice.name==selectedVoice&&'border'}`} 
                            onClick={() => {setSelectedVoice(voice.name);
                            onHandleInputChanges('voice', voice.value)
                            }} key={index}>{voice.name}</h2>
                ))}

            </div>
            </ScrollArea>
        </div>
    )
}

export default Voice