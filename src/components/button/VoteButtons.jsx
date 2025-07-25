import React, { useState } from 'react';
import { castVote } from '../../api/api';
import { useSelector } from 'react-redux';
import { getAuthUser } from '../../redux/userSlice';
import { ArrowUp, ArrowDown } from 'lucide-react';

const VoteButtons = ({ itemId, itemType, currentVotes, userId }) => {
  const user = useSelector(getAuthUser);
  const [votes, setVotes] = useState(currentVotes);

  const isOwnPost = user.id === userId;

  const vote = async (vote_type) => {
    if (isOwnPost) return; // just in case
    try {
      const payload = {
        authorId: user.id,
        item_id: itemId,
        item_type: itemType,
        vote_type,
      };
      const res = await castVote(payload);
      setVotes(votes + (vote_type === 'upvote' ? 1 : -1));
    } catch (err) {
      console.error('Vote failed', err);
    }
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={() => vote('upvote')}
        disabled={isOwnPost}
        className={`transition ${
          isOwnPost ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-700'
        }`}
        title="Upvote"
      >
        <ArrowUp size={18} />
      </button>
      <span className="font-medium text-gray-700">{votes}</span>
      <button
        onClick={() => vote('downvote')}
        disabled={isOwnPost}
        className={`transition ${
          isOwnPost ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700'
        }`}
        title="Downvote"
      >
        <ArrowDown size={18} />
      </button>
    </div>
  );
};

export default VoteButtons;
