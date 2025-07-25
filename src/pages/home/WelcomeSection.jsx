import React from 'react'
import { MdOutlineWavingHand } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProfile } from '../../redux/userSlice';


const WelcomeSection = () => {
    const navigate = useNavigate()
   
    const profile = useSelector(getProfile)
  return (
    <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            <div><MdOutlineWavingHand size={30} className='text-ibmblue' /></div>
            <div>
                <h1 className='text-[24px] font-bold'>Welcome Back, {profile.name}</h1>
                <p>Find answers to your technical questions and help others answer theirs.</p>
            </div>
        </div>
        
    </div>
  )
}

export default WelcomeSection