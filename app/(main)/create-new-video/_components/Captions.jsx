import React, { useState } from 'react'


const options = [
  {
    name: 'Youtuber',
    style: 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 bg-clip-text text-transparent text-4xl font-black uppercase tracking-wider drop-shadow-[0_0_30px_rgba(147,51,234,0.8)] animate-pulse',
  },
  {
    name: 'Supreme',
    style: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-4xl font-bold drop-shadow-[0_0_25px_rgba(6,182,212,0.7)] animate-bounce',
  },
  {
    name: 'Neon',
    style: 'text-emerald-400 text-4xl font-extrabold uppercase tracking-widest drop-shadow-[0_0_20px_#10b981] filter brightness-125 animate-pulse',
  },
  {
    name: 'Glitch',
    style: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent text-4xl font-black uppercase tracking-[0.3em] drop-shadow-[0_0_35px_rgba(251,146,60,0.9)]',
  },
  {
    name: 'Fire',
    style: 'bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 bg-clip-text text-transparent text-4xl font-extrabold uppercase drop-shadow-[0_0_40px_rgba(234,179,8,0.8)] animate-pulse filter brightness-110',
  }
];


const Captions = ({onHandleInputChanges}) => {

    const [selectedCationStyle, setSelectedCaptionStyle] = useState();

    return (
        <div>
            <h2>Cpation Style</h2>
            <p className='text-sm text-gray-400'>Select Caption Style</p>

            <div className='flex flex-wrap gap-4 mt-2'>
                {options.map((option, index) => (
                    <div key={index} 
                    onClick={() =>{ setSelectedCaptionStyle(option.name)
                        onHandleInputChanges(option.name, option.style)
                    }}
                    className={`p-2 hover:border background-slate-900 border-gray-400 cursor-pointer rounded-lg ${selectedCationStyle == option.name && 'border'}`}>
                        <h2 className={option.style}>{option.name}</h2>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Captions