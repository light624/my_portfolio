'use client'
import { Heading } from "./sub/Heading"
import { Achievements } from "./sub/Achievements"
import { aboutData,aboutText,downloadIcon,arrowLeftIcon } from "@/assets"
import Image from "next/image"
export const About = () => {
  return (
    <div  id="about"className="min-h-screen px-96 flex flex-col items-center justify-center">
        <Heading text={'About me'}/>
        <div className="w-full flex items-center justify-between md:justify-center">
            <Image src={'/about-me.png'}
             alt="About me"
              width={400}
               height={400}
               className="w-[300px] lg:w-[200px] md:hidden"
               />
            <div className="relative max-w-[800px] rounded-xl bg-zinc-100 p-5 text-justify dark:bg-zinc-700 transition-colors">"
                <span className="absolute -left-5 top-20 scale-[2.5px] text-zinc-100 md:hidden dark:text-zinc-700 transition-colors">" {arrowLeftIcon}</span>
                <p className="text-lg font-light text-gray-700 first-letter:pl-3  lg:text-[16px] sm:text-[14px] dark:text-white">{aboutText}</p>
                <a href="/nick-cv.pdf" download="" className="w-max flex items-center gap-x-2 mt-6 rounded-full border border-gray-600 bg-red-400 px-3 py-2 font-light text-white hover:bg-red-500 transition-colors">
                <span className="">Download CV</span>
                <span className="text-xl">{downloadIcon}</span>
                </a>
            </div>
        </div>
           <div className="mt-20 w-full flex flex-wrap items-center justify-between gap-x-7 gap-y-10">
            {aboutData.map((item,i)=>(
               <Achievements key={i}
                title={item.title}
                 amount={item.amount}
                 >
                    {item.icon}
                 </Achievements> 
            ))

            }
            
           </div>
    </div>
  )
}
