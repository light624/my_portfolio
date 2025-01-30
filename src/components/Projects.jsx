'use client'
import { Heading } from "./sub/Heading"
import { Project } from "./sub/Project"
export const Projects = () => {
  return (
    <div>
         <Heading text={'Projects'} />
         <div>
            <button>All</button>
            <div>
                <Project/>
                

            </div>
         </div>
    </div>
  )
}
