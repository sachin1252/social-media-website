import React from 'react'
import { Navigate, Outlet } from 'react-router';
import Login from '../pagess/login/Login';
import { getItem, KEY_ACCESS_TOKEN } from '../utilss/localStorageManager'

function RequireUser() {
    const user = getItem(KEY_ACCESS_TOKEN);
  return (
    user ? <Outlet /> : <Navigate to="/login"/>
  )
}

export default RequireUser