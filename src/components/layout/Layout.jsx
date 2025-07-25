import React,{useEffect} from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { getAuthUser, setProfile } from '../../redux/userSlice';
import { getUserById } from '../../api/api';

const Layout = () => {
  const dispatch = useDispatch()
  const user = useSelector(getAuthUser)
  useEffect(()=>{
    const getUserProfile = async ()=>{
      try {
        if(user){
          const res = await getUserById(user.id)
          dispatch(setProfile(res))
      
    } 
      } catch (error) {
        
      }
    }
   getUserProfile()

  },[])
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 pt-[34px] bg-ibmlight">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
