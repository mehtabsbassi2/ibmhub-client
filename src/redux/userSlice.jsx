import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user : null,
    profile:null,
   
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setAuthUser:(state,{payload})=>{
            state.user = payload
        },
        setProfile:(state,{payload})=>{
            state.profile = payload
        },
        
       logout: (state) => {
  state.user = null;
  state.profile = null;
}

    }
})

export const {setAuthUser,logout,setProfile} = userSlice.actions
export const getAuthUser =(state)=>state.user.user
export const getProfile =(state)=>state.user.profile

export default userSlice.reducer