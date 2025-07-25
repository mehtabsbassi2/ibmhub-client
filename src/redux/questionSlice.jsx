import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    questions:null,
    pagination:null,
    draftQuestions:null,
    userQuestions: null
    
}

const questionSlice = createSlice({
    name:"questions",
    initialState,
    reducers:{
        setQuestions:(state,{payload})=>{
            state.questions = payload
        },
        setPagination: (state,{payload}) =>{
            state.pagination = payload
        },setDraftQuestions: (state,{payload})=>{
            state.draftQuestions = payload
        },setUserQuestions: (state,{payload})=>{
            state.userQuestions = payload
        }
    }
})

export const {setQuestions,setPagination,setDraftQuestions,setUserQuestions} = questionSlice.actions
export const getAllQuestions =(state)=>state.questions.questions
export const getPagination =(state)=>state.questions.pagination
export const getDraftQuestions = (state)=>state.questions.draftQuestions
export const getUserQuestions = (state)=>state.questions.userQuestions


export default questionSlice.reducer