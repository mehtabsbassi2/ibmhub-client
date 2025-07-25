import axios from "axios";

//const BASE_URL = "http://localhost:5000/api"
const BASE_URL="https://ibmhub-backend.onrender.com/api"

const api = axios.create({
    baseURL:BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export const createUser = async (payload)=>{
    try {
        const res = await api.post("/users",payload)
        return res.data
    } catch (error) {
        console.log("Failed to create user",error)
    }
}
export const getDashboard = async (id)=>{
    try {
        
       const res = await api.get(`/users/dashboard/${id}`) 
       return res.data
    } catch (error) {
        console.log("Failed to load dashboard",error)
    }
}
export const getUserSkills = async (id)=>{
    try {
        const res = await api.get(`/skills/${id}`)
        return res.data
    } catch (error) {
        console.log("Failed to load user skills",error)
    }
}
export const addUserSkills = async (payload)=>{
try {
    const res = await api.post("/skills",payload)
    return res
} catch (error) {
    console.log("Failed to add user skills",error)
}
}
export const deleteUserSkill = async (id)=>{
    try {
        const res = await api.delete(`/skills/${id}`)
        return res
    } catch (error) {
        console.log("Failed to delete user skill",error)
    }
}
export const updateProfile = async (email,payload)=>{
    try {
        const res = await api.put(`/users/profile/${email}`,payload)
        return res
    } catch (error) {
                console.log("Failed to update profile",error)

    }
}
export const getUserById = async (id)=>{
    try {
        const res = await api.get(`/users/${id}`)
        return res.data
    } catch (error) {
        console.log("Failed to load user by id",error)
    }
}

export const createNewQuestion =async(payload)=>{
    try {
        const res = await api.post("/questions",payload)
        return res.data
    } catch (error) {
        console.log("Failed to create a new question,", error)
    }
}

export const getQuestions = async(payload)=>{
    try {
        const res = await api.get("/questions",payload)
        return res
    } catch (error) {
        console.log("Failed to load questions",error)
    }
}
export const getQuestionsByUserSkills = async (id,queryParams ={})=>{
    try {
        const res = await api.get(`/questions/user-skills/${id}`,{params:queryParams})
        return res
    } catch (error) {
        console.log("Failed to load questions by user id",error)
    }
}

export const getPublishedUserQuestions = async (id,queryParams ={})=>{
    try {
        const res = await api.get(`/questions/published/${id}`,{params:queryParams})
        return res
    } catch (error) {
        console.log("Failed to load questions by user id",error)
    }
}
export const getUserDraftQuestions = async (id,queryParams)=>{
    try {
        const res = await api.get(`/questions/drafts/${id}`,{params:queryParams})
        return res
    } catch (error) {
        console.log("Failed to load questions by user id",error)
    }
}
export const getQuestionById = async (id)=>{
    try {
        const res = await api.get(`/questions/${id}`)
        return res.data
    } catch (error) {
        console.log("Failed to load question by id")
    }
}

export const updateQuestion = async (id, payload) => {
  try {
    const res = await api.put(`/questions/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Failed to update question", error);
    throw error;
  }
};


export const answerQuestion = async (payload)=>{
    try {
        const res = await api.post("/answers",payload)
        return res.data
    } catch (error) {
        console.log("Failed to post answer",error)
    }
}

export const updateAnswer = async(id,payload)=>{
    try {
        const res = await api.put(`/answers/${id}`,payload)
        return res.data
    } catch (error) {
        console.log("Failed to update answer",error)
        return error.response.data
    }
}

export const getQuestionAnswers = async (id)=>{
    try {
       const res = await api.get(`/answers/${id}`) 
       return res.data
    } catch (error) {
       console.log ("Failed to fetch answers",error)
    }
}

export const markAnswerAsAccepted = async (answerId)=>{
    try {
        const res = await api.post(`/answers/${answerId}/accept`)
        return res.data
    } catch (error) {
        console.log("Failed to accept answer")
    }
}

export const castVote = async (payload) =>{
    try {
        const res = await api.post("/votes",payload)
        return res.data
    } catch (error) {
        console.log("Failed to cast vote",error)
    }
}
