"use client"

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import axios from 'axios'

const suggestions = [
  "Historic Story",
  "Kids Story",
  "Movie Stories",
  "AI Innovations",
  "Space Mysteries",
  "Horror Stories",
  "Mythological Tales",
  "Tech Breakthroughs",
  "True Crime Stories",
  "Fantasy Adventures",
  "Science Experiments",
  "Motivational Stories",
];

function Topic({onHandleInputChanges}) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [script, setScript] = useState()
  const [loading, setLoading] = useState(false)

  const [selectedScriptIndex, setSelectedScriptIndex] = useState();

  


  const GenarateScript=async()=>{
    setLoading(true);
    setSelectedScriptIndex(null)
    try{
    const result=await axios.post('/api/genarate-script',{
        topic:selectedTopic
    })
    console.log(result.data)
    setScript(result.data?.scripts)
}catch(e){
    console.log(e)
}
    setLoading(false)
  }

  return (
    <div>
      <h2 className='mb-1'>Project Title</h2>
      <Input placeholder='Enter Project Title' onChange={(event)=>onHandleInputChanges('title',event?.target.value)}/>

      <div className='mt-5'>
        <h2>Video Topic</h2>
        <p className='text-sm text-gray-600'>Select Topic For Your Video</p>

        <Tabs defaultValue="suggestion" className="w-full mt-2">
          <TabsList>
            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
            <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
          </TabsList>
          <TabsContent value="suggestion">
            <div className='flex flex-wrap'>
              {suggestions.map((suggestion) => (
                <Button 
                  onClick={() => {setSelectedTopic(suggestion)
                    onHandleInputChanges('topic', suggestion)
                  }} 
                  variant="outline"
                  key={suggestion}
                  className={`m-1 transition-all duration-200 ${
                    selectedTopic === suggestion 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md hover:from-indigo-600 hover:to-purple-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="your_topic">
            <div>
                <h2>
                    Enter Your Own Topic
                    <Textarea placeholder='Enter Your Topic Please'
                    onChange={(event)=>onHandleInputChanges('topic', event.target.value)}
                    />
                </h2>
            </div>
          </TabsContent>
        </Tabs>

        
            {script?.length>0&&
            <div className='mt-3'>
                <h2>Select The Script</h2>
            <div className='grid grid-cols-2 gap-5 mt-1'>
                {script?.map((item,index)=>(
                    <div key={index} className={`p-3 border cursor-pointer rounded-lg ${selectedScriptIndex == index && 'border-white bg-secondary'}`}
                    onClick={()=>{setSelectedScriptIndex(index);
                      onHandleInputChanges('script', item?.content)}
                    }
                    >
                        <h2 className='line-clamp-4 text-sm text-gray-300'>{item.content}</h2>
                    </div>
                ))}


        </div>
        </div>
        }

      </div>

     {!script &&<Button className='mt-3' size="sm" disabled={loading} onClick={GenarateScript}>{loading?<Loader2Icon className='animate-spin'/>:<SparklesIcon/>}Generate Script</Button>}

    </div>
  )
}

export default Topic