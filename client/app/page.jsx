"use client";
import { useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState(""); // For fetching single user data
  const [comments, setComments] = useState(""); // For posting new comments
  const [password, setPassword] = useState(""); // For posting new comments
  const [responseId, setResponseId] = useState(""); // ID from posted comment
  const [fetchedComments, setFetchedComments] = useState(""); // Comments fetched by ID
  const [allUserIds, setAllUserIds] = useState([]); // List of all user IDs

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // POST: Add comment
  const postComment = async () => {
    if (!password || !comments) {
      alert("Password and Comments are required");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          comment: comments,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to post comment");

      setResponseId(data._id); // Store the generated ID
      alert("Comment added successfully!");
    } catch (error) {
      console.error(error);
      alert("Error posting comment");
    }
  };

  // GET: Fetch comment by ID
  const fetchCommentById = async () => {
    if (!userId) {
      alert("Please enter a User ID");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/user/find?id=${userId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch comments");

      setFetchedComments(data.comment); // Display fetched comments
    } catch (error) {
      console.error(error);
      alert("Error fetching comments");
    }
  };

  // GET: Fetch all user IDs
  const fetchAllUserIds = async () => {
    try {
      const response = await fetch(`${backendURL}/api/users`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user IDs");

      setAllUserIds(data.map((user) => user._id)); // Extract IDs from response
    } catch (error) {
      console.error(error);
      alert("Error fetching all user IDs");
    }
  };

  return (
    <div className="flex bg-slate-600 justify-center min-h-screen text-white">
      <div className="mt-10 flex flex-col items-center gap-6">
        <h1 className="text-3xl">User Comments</h1>

        {/* POST: Add Comments */}
        <div className="flex flex-col gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 py-2 rounded-lg text-black"
            placeholder="Enter Password"
          />
          <input
            type="text"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="px-2 py-2 rounded-lg text-black"
            placeholder="Enter Comments"
          />
          <button
            onClick={postComment}
            className="px-4 py-2 bg-green-500 rounded-lg"
          >
            Post Comment
          </button>
        </div>

        {/* Display Created ID */}
        {responseId && (
          <div className="text-lg">
            <p>Comment added! Your User ID: {responseId}</p>
          </div>
        )}

        {/* GET: Fetch Comments */}
        <div className="flex flex-col gap-2 mt-8">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-2 py-2 rounded-lg text-black"
            placeholder="Enter User ID to Fetch"
          />
          <button
            onClick={fetchCommentById}
            className="px-4 py-2 bg-blue-500 rounded-lg"
          >
            Fetch Comment
          </button>
        </div>

        {/* Display Fetched Comments */}
        {fetchedComments && (
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <p>Comments: {fetchedComments}</p>
          </div>
        )}

        {/* GET: Fetch All User IDs */}
        <button
          onClick={fetchAllUserIds}
          className="px-4 py-2 bg-purple-500 rounded-lg mt-6"
        >
          Fetch All User IDs
        </button>

        {/* Display All User IDs */}
        {allUserIds.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <h2 className="text-xl mb-2">All User IDs:</h2>
            <ul className="list-disc pl-4">
              {allUserIds.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
