import React from 'react'
import {Route,Routes} from "react-router-dom"
import MyContributions from '../pages/MyContributions'
import MyStories from '../pages/MyStories'
import UserProfile from '../pages/UserProfile'
import StoryPage from '../pages/StoryPage'
import CreateStoryPage from '../pages/CreateStoryPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import HomePage from '../pages/HomePage'


const Router = () => {
  return (
    <>
    <Routes>
            <Route path='/' element={<HomePage/>}/>
            {/* <Route path='/' element={<HomePage/>}/>
            <Route path='/' element={<HomePage/>}/> */}
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/create' element={<CreateStoryPage/>}/>
            <Route path='/story/:id' element={<StoryPage/>}/>
            <Route path='/profile/:id' element={<UserProfile/>}/>
            <Route path='/my-stories' element={<MyStories/>}/>
            <Route path='/my-contributions' element={<MyContributions/>}/>




    </Routes>
   
    
    
    
    </>
  )
}

export default Router