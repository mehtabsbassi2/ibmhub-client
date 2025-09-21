import React, { useState } from "react";
import { castVote } from "../../api/api";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../redux/userSlice";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";

const VoteButtons = ({ itemId, itemType, currentVotes, userId }) => {
  const user = useSelector(getAuthUser);
  const [votes, setVotes] = useState(currentVotes);
  const [userVote, setUserVote] = useState(null);
  const [loadingUp, setLoadingUp] = useState(false);
  const [loadingDown, setLoadingDown] = useState(false);

  const isOwnPost = user.id === userId;

  const vote = async (vote_type) => {
    if (isOwnPost) return;

    // Set specific loader
    if (vote_type === "upvote") setLoadingUp(true);
    if (vote_type === "downvote") setLoadingDown(true);

    try {
      const payload = {
        authorId: user.id,
        item_id: itemId,
        item_type: itemType,
        vote_type,
      };

      const res = await castVote(payload); // res is already JSON
      console.log("Res:", res);

      if (res.error) {
        console.warn(res.error);
      } else {
        setVotes(res.newVoteCount);
        setUserVote(res.userVote);
      }
    } catch (err) {
      console.error("Vote failed", err);
    } finally {
      // Reset the correct loader
      if (vote_type === "upvote") setLoadingUp(false);
      if (vote_type === "downvote") setLoadingDown(false);
    }
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Upvote */}
      <button
        onClick={() => vote("upvote")}
        disabled={isOwnPost || loadingUp}
        className={`transition ${
          isOwnPost
            ? "text-gray-400 cursor-not-allowed"
            : userVote === "upvote"
            ? "text-green-700 font-bold"
            : "text-green-600 hover:text-green-700"
        }`}
        title="Upvote"
      >
        {loadingUp ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ArrowUp size={18} />
        )}
      </button>

      {/* Vote count */}
      <span className="font-medium text-gray-700">{votes}</span>

      {/* Downvote */}
      <button
        onClick={() => vote("downvote")}
        disabled={isOwnPost || loadingDown}
        className={`transition ${
          isOwnPost
            ? "text-gray-400 cursor-not-allowed"
            : userVote === "downvote"
            ? "text-red-700 font-bold"
            : "text-red-600 hover:text-red-700"
        }`}
        title="Downvote"
      >
        {loadingDown ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <ArrowDown size={18} />
        )}
      </button>
    </div>
  );
};

export default VoteButtons;
