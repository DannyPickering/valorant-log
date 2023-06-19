import React from 'react'
import AddMaps from './add-maps'
import ValorantMaps from './ValorantMaps'
import MapsSkeleton from './MapsSkeleton'

export default function page() {
  return (
    <div className="py-8 flex flex-col w-full">
      <h1 className="mb-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Manage Maps</h1>
      <ValorantMaps />
      <AddMaps />
    </div>
  )
}
