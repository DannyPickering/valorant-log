import React from 'react'
import AddAgents from './AddAgents'
import Typography from '@/components/Typography'
import ValorantAgents from './ValorantAgents'

export default function ManageAgents() {
  return (
    <div className="py-8">
      <Typography element="h1" as="h1">Manage Agents</Typography>
      <ValorantAgents />
      <AddAgents />
    </div>
  )
}
