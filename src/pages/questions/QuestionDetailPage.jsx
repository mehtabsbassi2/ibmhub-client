import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import TiptapEditor from "../../components/tipTap/TiptapEditor";
import {
  answerQuestion,
  getQuestionAnswers,
  getQuestionById,
  markAnswerAsAccepted,
  updateAnswer,
  updateQuestion,
} from "../../api/api";
import VoteButtons from "../../components/button/VoteButtons";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../redux/userSlice";
import {
  ThumbsUp,
  Target,
  Medal,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import { toastError, toastSuccess } from "../../components/Toastify";

const difficultyOptions = ["Junior", "Mid", "Senior"];

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus,setEditStatus] = useState("published")
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("Junior");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");
  const user = useSelector(getAuthUser);

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await getQuestionById(id);
      setQuestion(res);
    } catch (error) {
      console.error("Failed to load question", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const res = await getQuestionAnswers(id);
      const sorted = [...res].sort((a, b) => b.votes - a.votes);
      setAnswers(sorted);
    } catch (error) {
      console.log("Failed to load answers", error);
    }
  };

  const markAsAccepted = async (id)=>{
    
    try {
      const res = await markAnswerAsAccepted(id)
      console.log("Clicked",res)
    } catch (error) {
      
    }
  }

  const handlePostAnswer = async () => {
    const plainText = content.replace(/<[^>]+>/g, "").trim();
    if (plainText.length < 10 || plainText.length > 3000) {
      toastError("Answer must be between 10 and 3000 characters.");
      return;
    }
    if (user.id === question.authorId) {
      toastError("You cannot answer your own question.");
      return;
    }
    try {
      const payload = { authorId: user.id, questionId: id, content };
      await answerQuestion(payload);
      setContent("");
      fetchAnswers();
    } catch (error) {
      console.error("Failed to post answer", error);
    }
  };

  const handleQuestionSave = async (isDraft) => {
    const plain = editContent.replace(/<[^>]+>/g, "").trim();
    if (editTitle.trim().length < 10 || editTitle.trim().length > 150) {
      toastError("Title must be between 10 and 150 characters.");
      return;
    }
    if (editTags.length < 1 || editTags.length > 5) {
      toastError("Must have 1 to 5 tags.");
      return;
    }
    if (plain.length < 50) {
      toastError("Content must be at least 50 characters.");
      return;
    }

    try {
      const payload = {
        title: editTitle.trim(),
        tags: editTags,
        difficulty: editDifficulty,
        content: editContent,
        status: isDraft ? "draft" : "published",
        userId: user.id,
      };
      await updateQuestion(question.id, payload);
      toastSuccess("Question updated");
      setIsEditingQuestion(false);
      fetchQuestion();
    } catch (err) {
      toastError("Failed to update question");
    }
  };

  const cancelEdit = () => {
    setEditTitle("");
    setEditContent("");
    setEditTags([]);
    setEditDifficulty("Junior");
    setIsEditingQuestion(false);
  };

  if (!question) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="bg-ibmlight  w-[calc(100vw-350px)] min-h-screen font-sans">
      <div className="w-full bg-white p-6 rounded-lg shadow border border-gray-200 ">
        {isEditingQuestion ? (
          <>
            <div>
              <label className="block font-semibold text-lg mb-2">
                Title *
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit title..."
                className="w-full text-sm text-gray-800 border border-gray-300 px-3 py-2 rounded mb-4"
              />
            </div>

            <TiptapEditor content={editContent} onChange={setEditContent} />

            <div className="my-3">
              <label className="block font-semibold text-lg mb-2">Tags *</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editTags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      className="ml-1"
                      onClick={() =>
                        setEditTags(editTags.filter((_, i) => i !== index))
                      }
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  className="text-sm bg-ibmblue text-white px-3 py-1 rounded"
                  onClick={() => {
                    const trimmed = newTag.trim();
                    if (
                      trimmed &&
                      /^[a-zA-Z0-9+&@#_-]+$/.test(trimmed) &&
                      !editTags.includes(trimmed) &&
                      editTags.length < 5 &&
                      trimmed.length >= 2 &&
                      trimmed.length <= 20
                    ) {
                      setEditTags([...editTags, trimmed]);
                      setNewTag("");
                    } else {
                      toastError("Invalid or duplicate tag.");
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="mt-4 mb-2">
              <label className="block font-semibold text-lg mb-2">
                Difficulty *
              </label>
              <select
                value={editDifficulty}
                onChange={(e) => setEditDifficulty(e.target.value)}
                className="w-[200px] border border-gray-300 p-3 rounded text-base"
              >
                {difficultyOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 py-8">
               <button
                onClick={()=>handleQuestionSave(true)}
                className="bg-ibmblue text-white px-4 py-2 rounded font-semibold"
              >
                Save to draft
              </button>
              <button
                onClick={()=>handleQuestionSave(false)}
                className="bg-ibmblue text-white px-4 py-2 rounded font-semibold"
              >
                Publish
              </button>
              <button
                onClick={cancelEdit}
                className="text-gray-600 px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="w-full">
            <h1 className="text-2xl font-bold text-ibmblue mb-2">
              {question.title}
            </h1>
            <div className="text-sm text-gray-500 mb-4">
              asked by <strong className="text-ibmblue">{question.author?.name}</strong> ·{" "}
              {formatDistanceToNow(new Date(question.createdAt), {
                addSuffix: true,
              })}
            </div>
            
            <div
              className="prose max-w-none text-gray-800 mb-4 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          {question.status === "published" && 
          <div className="text-sm text-gray-700 flex flex-wrap gap-6 items-center">
            <span className="flex items-center gap-1">
              <ThumbsUp size={16} className="text-ibmblue" /> {question.votes} votes
            </span>
            <span className="flex items-center gap-1">
              <Target size={16} className="text-ibmblue" /> {question.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Medal size={16} className="text-ibmblue" /> {question.skill_points} pts
            </span>
            <span className="flex items-center gap-1">
              {question.is_solved ? (
                <>
                  <CheckCircle2 size={16} className="text-green-600" />{" "}
                  <span className="text-green-600">Solved</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-red-500" />{" "}
                  <span className="text-red-500">Unsolved</span>
                </>
              )}
            </span>
          </div>
          }
          <div className="w-full flex justify-end">
            {user.id === question.authorId && (
              <button
                onClick={() => {
                  setEditTitle(question.title);
                  setEditContent(question.content);
                  setEditTags(question.tags);
                  setEditDifficulty(question.difficulty);
                  setIsEditingQuestion(true);
                }}
                className="text-sm text-white bg-ibmblue px-6 py-3 rounded-xl font-medium hover:bg-blue-700 mb-2"
              >
                Edit Question
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Answer Section */}
      {question && question.status === "published" && 
      
      <div className="mt-12 ">
        <h2 className="text-xl font-semibold mb-4">
          {answers.length} Answer{answers.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-6">
          {answers.map((answer) => {
            const canEdit =
              answer.authorId === user.id &&
              differenceInHours(new Date(), new Date(answer.createdAt)) < 24;

            return (
              <div
                key={answer.id}
                className={`bg-white p-4 border rounded-lg shadow-sm ${
                  answer.is_accepted
                    ? "border-green-400 ring-2 ring-green-300"
                    : "border-gray-200"
                }`}
              >
                {answer.is_accepted && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mb-2">
                    <CheckCircle2 size={16} /> Accepted Answer
                  </div>
                )}

                {editingAnswerId === answer.id ? (
                  <>
                    <TiptapEditor
                      content={editAnswerContent}
                      onChange={setEditAnswerContent}
                    />
                    <div className="flex justify-end gap-2 py-8">
                      <button
                        onClick={async () => {
                          const plain = editAnswerContent
                            .replace(/<[^>]+>/g, "")
                            .trim();
                          if (plain.length < 10) {
                            toastError(
                              "Answer must be at least 10 characters."
                            );
                            return;
                          }
                          const res = await updateAnswer(answer.id, {
                            content: editAnswerContent,
                            userId: user.id,
                          });
                          toastSuccess(res.message);
                          setEditingAnswerId(null);
                          fetchAnswers();
                        }}
                        className="bg-ibmblue text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAnswerId(null)}
                        className="text-gray-600 px-3 py-1 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className="prose w-full max-w-none text-gray-800 mb-3"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />
                )}

                <div className="text-sm text-gray-500 flex justify-between flex-wrap gap-2">
                  <div className="flex gap-3 items-center">
                    <span>
                      Answered by <strong className="text-ibmblue">{answer.author?.name}</strong>
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(answer.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                     <VoteButtons
                      itemId={answer.id}
                      itemType="answer"
                      currentVotes={answer.votes}
                      userId={answer.authorId}
                    />
                   
                    {question.authorId === user.id && !answer.is_accepted && (
                      <button
                        onClick={() => markAsAccepted(answer.id)}
                        className="text-sm text-ibmblue font-medium hover:underline"
                      >
                        Mark as Accepted
                      </button>
                    )}
                    {canEdit && editingAnswerId !== answer.id && (
                      <button
                        onClick={() => {
                          setEditAnswerContent(answer.content);
                          setEditingAnswerId(answer.id);
                        }}
                        className="text-sm text-ibmblue font-medium hover:underline"
                      >
                        Edit Answer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      }

      {/* Answer Form */}
      {user.id !== question.authorId && (
        <div className="mt-24">
          <h1 className="text-[24px] py-4 font-semibold">Your answer</h1>
          <TiptapEditor content={content} onChange={setContent} />
          <div className="flex justify-end py-4">
            <button
              onClick={handlePostAnswer}
              className="bg-ibmblue text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              Post your answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
