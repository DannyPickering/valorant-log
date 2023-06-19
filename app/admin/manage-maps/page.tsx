import React from 'react'
import AddMaps from './add-maps'
import ValorantMaps from './ValorantMaps'

export default function page() {
  return (
    <div className="py-4 flex flex-col w-full">
      <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Valorant Maps</h1>
      <ValorantMaps />
      <AddMaps />
    </div>
  )
}
