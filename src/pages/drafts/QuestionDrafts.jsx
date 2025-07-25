import React,{useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { getProfile } from '../../redux/userSlice';
import { getUserDraftQuestions } from '../../api/api';
import { getDraftQuestions, setDraftQuestions } from '../../redux/questionSlice';
import QuestionCard from '../questions/QuestionCard.';

const QuestionDrafts = () => {
    const [search, setSearch] = useState("");
      const [difficulty, setDifficulty] = useState("");
      const [tag, setTag] = useState("");
      const [status, setStatus] = useState("all");
      const [userSkills, setUserSkills] = useState([]);
    
      const [sortBy, setSortBy] = useState("newest");
       const [currentPage, setCurrentPage] = useState(1);
        const [pagination, setPagination] = useState(null);
        
      
        const profile = useSelector(getProfile)
        const dispatch = useDispatch()
          const quizes = useSelector(getDraftQuestions);
        

      useEffect(()=>{
        const fetchQuestionByUserSkills = async () =>{
          try {
            const queryParams = {
                
                  search,
                  difficulty,
                  tag,
                  is_solved: status === "all" ? undefined : status === "solved" ? "true" : "false",
                  sort: sortBy,
                   page:currentPage
                
              };
            const res = await getUserDraftQuestions(profile.id,queryParams)
            dispatch(setDraftQuestions(res.data.questions || []))
            setPagination(res.data.pagination);
      
            console.log("RES",res)
      
          } catch (error) {
            
          }
        }
        fetchQuestionByUserSkills()
      },[profile?.id, search, difficulty, tag, status, sortBy, currentPage])
  return (
    <div>
         {/* Cards */}
      <div className=" w-[calc(100vw-350px)] space-y-4">

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
      </div>
    </div>
  )
}

export default QuestionDrafts