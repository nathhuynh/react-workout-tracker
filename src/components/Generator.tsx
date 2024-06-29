// import React from 'react'
// import SectionWrapper from './SectionWrapper'
// import { SCHEMES, WORKOUTS } from '../utils/exercises'

// function Header(props) {
//     const { idx, title, desc } = props
//     return (
//         <div className="flex flex-col gap-4">
//             <div className="justify-center gap-3 items-center flex">
//                 <p className="text-4xl sm:text-5xl md:text-6xl font-semibold text-violet-400">{idx}</p>
//                 <h4 className="text-xl sm:text-2xl md:text-3xl">{title}</h4>
//             </div>
//             <p className="text-sm sm:text-base mx-auto">{desc}</p>
//         </div>
//     )
// }

// export default function Generator() {
//     return (
//         <SectionWrapper header={"Create a workout"} title={["Time", "to", "lift"]} >
//             <Header idx={"01"} title={"Exercise Selection"} desc={"Select your workout split"} />

//             <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">

//                 {Object.keys(WORKOUTS).map((type, typeIdx) => {
//                     return (
//                         <button className="rounded-lg border-[2px] border-solid border-violet-400 bg-slate-950 py-5 buttonShadow duration-150" key={typeIdx}>
//                             <p className="capitalize">{type.replaceAll('_', " ")}</p>
//                         </button>
//                     )
//                 })}
//             </div>
//         </SectionWrapper>
//     )
// }