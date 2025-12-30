import axios from "axios";
import { validateResponse } from "./apiValidator";

const BASE_URL = "http://3.8.153.96:3000/api"
//const BASE_URL = "http://localhost:3000/api"
//const BASE_URL="https://ibmhubbackend.netlify.app/api"

const api = axios.create({
    baseURL:BASE_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

// export const createUser = async (payload)=>{
//     try {
//         const res = await api.post("/users",payload)
//         return res.data
//     } catch (error) {
//         console.log("Failed to create user",error)
//         throw error
//     }
// }

export const createUser = async (payload) => {
    try {
        const res = await api.post("/users", payload)
        const validatedData = validateResponse(res)
        return validatedData
    } catch (error) {
        console.error("Failed to create user", error)
        throw error
    }
}

 // FIXED CODE:
export const toggleAdmin = async (id) => {
    try {
        const res = await api.put(`/users/toggle-admin/${id}`)
        const validatedData = validateResponse(res)
        return validatedData
    } catch (error) {
        console.log("Failed to toggle admin status", error)
        throw error // Also added error throwing for better handling
    }
}

export const getUsers = async()=>{
    try {
        const res = await api.get("/users")
        const validatedData = validateResponse(res)
        return validatedData
    } catch (error) {
                console.log("Failed to load users",error)
        throw error
    }
}

export const updateUserPoints = async(id,newPoints)=>{
    try {
        const res = await api.put(`/users/${id}/points`,{newPoints})
        return res.data
    } catch (error) {
        console.log("Failed to update user points",error)
    }
}

export const getUserBadges = async (userId)=>{
    try {
        const res = await api.get(`/badges/user/${userId}`)
        return res.data
    } catch (error) {
        console.log("Failed to fetch user badges",error)
    }
}
export const addUserTargetRole = async(data)=>{
    try {
        const res = await api.post("/target-roles",data)
        return res
    } catch (error) {
        console.log("Failed to add user roles",error)
    }
}

export const updateUserTargetRole =async (id,payload)=>{
    try {
        const res = await api.put(`/target-roles/${id}`,payload)
        return res
    } catch (error) {
        console.log("Failed to update target role",error)
    }
}
 export const getUserTargetRoles = async (id)=>{
    try {
       const res = await api.get(`/target-roles/${id}`) 
       return res.data
    } catch (error) {
        console.log("Failed to get user roles",error)
    }
 }

 export const deleteUserTargetRole = async (id)=>{
    try {
        const res = await api.delete(`/target-roles/${id}`)
        return res
    } catch (error) {
        console.log("Failed to delete target roles",error)
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
export const getQuestionById = async (id,userId)=>{
    try {
        const res = await api.get(`/questions/${id}?userId=${userId}`)
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
        return res
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

export const addUserToAdmin = async (payload)=>{
    try {
        const res = await api.post('/admin-users/add',payload)
        console.log("RES",res)
        return res.data
    } catch (error) {
      console.log("Failed add user to admin",error)  
    }
}

export const RemoveUserToAdmin = async (payload)=>{
    try {
        const res = await api.delete('/admin-users/remove',{data:payload})
        return res.data
    } catch (error) {
      console.log("Failed add user to admin",error)  
    }
}

export const getUsersForadmin = async (adminId)=>{
    try {
        const res = await api.get(`/admin-users/admin/${adminId}/users`)
        return res.data
    } catch (error) {
             console.log("Failed to get admin users",error)  
 
    }
}

export const getAvailableUsersForAdmin = async (adminId) => {
  try {
    const res = await api.get(`/admin-users/available/${adminId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch available users:", error);
    throw error;
  }
};


export const getUserTargetRolesWithUserSkills = async (userId)=>{
    try {
        const res = await api.get(`/target-roles/${userId}/roles-with-skills`)
        return res.data;
    } catch (error) {
           console.error("Failed to load user skills:", error);
    throw error;
    }
}
