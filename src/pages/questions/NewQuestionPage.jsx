import React, { useState } from 'react';
import TiptapEditor from '../../components/tipTap/TiptapEditor';
import { createNewQuestion } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS_PAGE } from '../../util/Routes';
import { useSelector } from 'react-redux';
import { getAuthUser } from '../../redux/userSlice';
import { toastError, toastSuccess } from '../../components/Toastify';

const NewQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const user = useSelector(getAuthUser);

  const handleTagAdd = (e) => {
  e.preventDefault();
  const newTag = tagInput.trim().toLowerCase();

  if (
    newTag &&
    !tags.includes(newTag) &&
    tags.length < 5 &&
    /^[a-zA-Z0-9+#.\-]{2,20}$/.test(newTag)
  ) {
    setTags([...tags, newTag]);
    setErrors((prev) => ({ ...prev, tags: '' }));
  } else if (!/^[a-zA-Z0-9+#.\-]{2,20}$/.test(newTag)) {
    setErrors((prev) => ({
      ...prev,
      tags: 'Tags must be 2–20 characters. Letters, numbers, +, #, ., - allowed.',
    }));
  }

  setTagInput('');
};


  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const getPoints = () => {
    switch (difficulty) {
      case 'Junior':
        return 10;
      case 'Mid':
        return 20;
      case 'Senior':
        return 30;
      default:
        return '';
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!title.trim() || title.trim().length < 10 || title.trim().length > 150) {
      newErrors.title = 'Title must be between 10 and 150 characters.';
    }

    const plainTextContent = content.replace(/<[^>]+>/g, '').trim();
    if (!plainTextContent || plainTextContent.length < 50 || plainTextContent.length > 5000) {
      newErrors.content = 'Content must be between 50 and 5000 characters.';
    }

    if (!difficulty || !['Junior', 'Mid', 'Senior'].includes(difficulty)) {
      newErrors.difficulty = 'Please select a valid difficulty level.';
    }

    if (tags.length < 1 || tags.length > 5) {
      newErrors.tags = 'Please add 1 to 5 valid tags.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSave = async (isDraft = false) => {
  if (!isDraft && !validate()) {
    toastError('Please fix the validation errors.');
    return;
  }

  const points = getPoints();
  const newQuestion = {
    title: title.trim(),
    author_id: user.id,
    content,
    tags,
    difficulty,
    skill_points: getPoints(),
    status: isDraft ? "draft" : "published", // NEW status flag
  };

  try {
    const res = await createNewQuestion(newQuestion);
    if (res.success) {
      toastSuccess(isDraft ? "Saved as draft!" : "Question submitted successfully!");
      navigate(QUESTIONS_PAGE);
    }
  } catch (error) {
    console.error("Failed to create question:", error);
    toastError("Something went wrong. Try again.");
  }
};


  return (
    <div className="bg-[#f4f7fb] min-h-screen px-4 md:px-10 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-ibmblue mb-8 text-left">Ask a Public Question</h1>

      <div className=" mx-auto bg-white border border-gray-200 rounded-2xl shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold text-lg mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to filter arrays in JavaScript?"
            className={`w-full border p-3 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-ibmblue/50 transition ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold text-lg mb-2">Content *</label>
          <TiptapEditor content={content} onChange={setContent} />
          {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold text-lg mb-2">Tags *</label>
          <p className="text-sm text-gray-500 mb-2">Add up to 5 tags (2–20 alphanumeric characters).</p>
          <form onSubmit={handleTagAdd} className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Press Enter to add"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            />
          </form>

          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-gray-100 px-4 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.tags && <p className="text-sm text-red-600 mt-1">{errors.tags}</p>}
        </div>

        {/* Difficulty + Points */}
        <div>
          <label className="block font-semibold text-lg mb-2">Difficulty *</label>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full md:w-[60%] border p-3 rounded-xl text-base ${
                errors.difficulty ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select Difficulty --</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>

            {difficulty && (
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-600 font-medium">Points:</label>
                <input
                  type="text"
                  value={getPoints()}
                  readOnly
                  className="w-16 text-center border border-gray-300 p-2 rounded-lg bg-gray-100"
                />
              </div>
            )}
          </div>
          {errors.difficulty && (
            <p className="text-sm text-red-600 mt-1">{errors.difficulty}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-8 justify-end">
  <button
    onClick={() => handleSave(true)} // Save as draft, skip validation
    className="bg-ibmlight text-ibmblue px-6 py-3 rounded-xl font-semibold hover:bg-ibmborder transition-colors"
  >
    Save to Draft
  </button>
  <button
    onClick={() => handleSave(false)} // Validate and submit
    className="bg-ibmblue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
  >
    Submit Question
  </button>
</div>

      </div>
    </div>
  );
};

export default NewQuestionPage;
