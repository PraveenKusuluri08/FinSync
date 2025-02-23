import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { get_all_groups } from '../../store/middleware/middleware';

const GroupsTable = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  useEffect(()=>{
    dispatch(get_all_groups())
  },[])
   
  return (
    <div>
      
    </div>
  )
}

export default GroupsTable
