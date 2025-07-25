import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import VoteButtons from "../../components/button/VoteButtons";
import {
  ThumbsUp,
  MessageCircle,
  Target,
  Medal,
  CheckCircle,
  XCircle,
} from "lucide-react";

const QuestionCard = ({ question }) => {
  return (
    <div className="w-full  overflow-hidden break-words bg-white  rounded-lg p-4  transition">
      {/* Title and Solved status */}
      <div className="w-full flex justify-between items-start mb-2">
        <Link to={`/questions/${question.id}`}>
          <h2 className="text-lg font-semibold text-ibmblue hover:underline">
            {question.title}
          </h2>
        </Link>
        {question.status === "published" && 
        <span
          className={`text-xs px-2 py-1 rounded inline-flex items-center gap-1 ${
            question.is_solved
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {question.is_solved ? (
            <>
              <CheckCircle size={14} /> Solved
            </>
          ) : (
            <>
              <XCircle size={14} /> Unsolved
            </>
          )}
        </span>
        }
        
      </div>

      {/* Content preview (max 2 lines) */}
      <div
        className="w-full text-sm text-gray-700 mb-3 overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          width: "100%",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <div
          className="max-w-none break-words whitespace-normal"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 text-sm mb-3">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Info Row */}
      {question && question.status === "published" && 
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex gap-4 items-center flex-wrap">
          <span className="flex items-center gap-1">
            <ThumbsUp size={14} className="text-ibmblue" /> {question.votes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} className="text-ibmblue" />{" "}
            {question.answerCount}
          </span>
          <span className="flex items-center gap-1">
            <Target size={14} className="text-ibmblue" /> {question.difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Medal size={14} className="text-ibmblue" /> {question.skill_points}{" "}
            pts
          </span>
          <div>
            <VoteButtons
              itemId={question.id}
              itemType="question"
              currentVotes={question.votes}
              userId={question.authorId}
            />
          </div>
        </div>
        <div>
          <span className="italic">
            asked by{" "}
            <span className="text-ibmblue">{question.author?.name}</span> ·{" "}
            {formatDistanceToNow(new Date(question.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
      }
      
    </div>
  );
};

export default QuestionCard;
