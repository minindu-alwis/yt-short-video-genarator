"use client"

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

  return (
    <div>
      <h2 className='mb-1'>Project Title</h2>
      <Input placeholder='Enter Project Title'/>

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
      </div>
    </div>
  )
}

export default Topic