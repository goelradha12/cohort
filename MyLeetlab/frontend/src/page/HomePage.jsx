import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const HomePage = () => {
  const {authUser} = useAuthStore();
  return (
    <div>
      Home page, {authUser.name}
    </div>
  )
}

export default HomePage
