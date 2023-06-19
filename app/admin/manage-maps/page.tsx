import React from 'react'
import AddMaps from './AddMaps'
import ValorantMaps from './ValorantMaps'
import Typography from '@/components/Typography'

export default function ManageMaps() {
  return (
    <div className="py-8">
      <Typography element="h1" as="h1">Manage Maps</Typography>
      <ValorantMaps />
      <AddMaps />
    </div>
  )
}
