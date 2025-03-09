import React from 'react'
import { useParams } from 'react-router-dom'

const ViewUserInGroup = () => {
    const params = useParams()
    const {group_id,email} = params

    console.log(group_id,email)

    

  return (
    <div>
      View User in group
    </div>
  )
}

export default ViewUserInGroup
