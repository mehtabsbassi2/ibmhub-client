import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard.";
import { getQuestions, getQuestionsByUserSkills, getUserSkills } from "../../api/api";
import { useSelector, useDispatch } from "react-redux";
import { getAllQuestions, getPagination, setPagination, setQuestions } from "../../redux/questionSlice";
import { ASK_NEW_QUESTION, DRAFTS, USER_QUESTIONS } from "../../util/Routes";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../redux/userSlice";
import { MdOutlineDrafts } from "react-icons/md"; 
import { PiQuestionFill } from "react-icons/pi";



const Questions = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("all");
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("newest");
  // const [questions, setQuestions] = useState([]);
  const quizes = useSelector(getAllQuestions);
  const [pagination, setPagination] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  console.log("PAG",pagination)
  const profile = useSelector(getProfile)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params = {
          params: {
            search,
            difficulty,
            tag,
            is_solved: status === "all" ? undefined : status === "solved" ? "true" : "false",
            sort: sortBy,
            page:currentPage
          },
        };
        const res = await getQuestions(params);
        dispatch(setQuestions(res.data.questions || []));
              setPagination(res.data.pagination);


              console.log("Pagination",pagination)

      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    //fetchQuestions();
  }, [search, difficulty, tag, status, sortBy,currentPage]);
  useEffect(()=>{
    const getSkills = async ()=>{
      try {
        const res = await getUserSkills(profile?.id)
        setUserSkills(res)
        console.log("Tags",res)
      } catch (error) {
        
      }
    }
    getSkills()
  },[profile?.id])

useEffect(()=>{
  const fetchQuestionByUserSkills = async () =>{
    try {
      setLoading(true)
      const queryParams = {
          
            search,
            difficulty,
            tag,
            is_solved: status === "all" ? undefined : status === "solved" ? "true" : "false",
            sort: sortBy,
             page:currentPage
          
        };
      const res = await getQuestionsByUserSkills(profile.id,queryParams)
      dispatch(setQuestions(res.data.questions || []))
      setPagination(res.data.pagination);

      console.log("Pagination",pagination)

    } catch (error) {
      setLoading(false)
    }finally{
      setLoading(false)
    }
  }
  fetchQuestionByUserSkills()
},[profile?.id, search, difficulty, tag, status, sortBy, currentPage])

  const handleAsk = () =>{
          navigate(ASK_NEW_QUESTION)
      }

      const handlePageChange = (page) => {
  if (page >= 1 && page <= pagination?.totalPages) {
    setCurrentPage(page);
  }
};


  return (
    <div className="w-[calc(100vw-336px)] bg-ibmlight p-6">
      <div>
       
      </div>
      <div className="flex items-center justify-between pb-4">
        <div><h1 className="text-xl font-bold text-ibmblue ">Browse Questions</h1></div>
        <div className="flex items-center gap-4">
         <h1 onClick={()=>navigate(USER_QUESTIONS)} className="flex gap-1 text-ibmblue font-bold cursor-pointer">My Questions <PiQuestionFill size={24}/></h1> 
        <h1 onClick={()=>navigate(DRAFTS)} className="flex gap-1 text-ibmblue font-bold cursor-pointer">Drafts <MdOutlineDrafts size={24}/></h1> 

        </div>
      </div>
      
      <div className="flex items-center ">
        <div className="w-full flex flex-wrap  py-6">
        <div className="">
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className=" flex items-center justify-end gap-3">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Difficulties</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>

          <select
  value={tag}
  onChange={(e) => setTag(e.target.value)}
  className="border border-gray-300 rounded px-3 py-2"
>
  <option value="">All Tags</option>
  {userSkills.map((skill) => (
    <option key={skill.id} value={skill.skill_name}>
      {skill.skill_name.charAt(0).toUpperCase() + skill.skill_name.slice(1)}
    </option>
  ))}
</select>


          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="all">All Questions</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostVoted">Most Voted</option>
          </select>
        </div>
      </div>
<div className="w-1/4 flex justify-end" >
            <button onClick={handleAsk} className="btn btn-outline bg-ibmlight border-ibmblue hover:bg-ibmblue text-ibmblack hover:text-ibmlight transition-all ease-in-out duration-500">Ask Question</button>

        </div>

      </div>

      {/* Cards */}
     {loading ? (<div className="flex justify-center p-6"><span className="loading loading-bars loading-xl text-ibmblue"></span></div>) : <div className="w-full space-y-4">

        {Array.isArray(quizes) && quizes.length > 0 ? (
          quizes.map((q) => <QuestionCard key={q.id} question={q} />)
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">No questions found.</p>
            <p className="text-sm">
              Try adjusting your filters or come back later.
            </p>
          </div>
        )}
      </div>}
      
      {/* Manual Pagination Controls */}
{pagination?.totalPages >= 1 && (
  <div className="flex justify-center items-center mt-6 space-x-4">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded border ${
        currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-ibmblue text-white hover:bg-gray-100'
      }`}
    >
      Prev
    </button>

    <span className="text-sm text-gray-700">
      Page {currentPage} of {pagination.totalPages}
    </span>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === pagination.totalPages}
      className={`px-4 py-2 rounded border ${
        currentPage === pagination.totalPages
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-ibmblue text-white hover:bg-gray-100'
      }`}
    >
      Next
    </button>
  </div>
)}

      
     
  



    </div>
  );
};

export default Questions;
