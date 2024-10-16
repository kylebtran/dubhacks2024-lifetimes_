import React, { useState } from "react";
import Image from "next/image";
import { Ellipsis, UserPlus } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Icons from "./Icons";
import Username from "./Username";
import { Post } from "../(models)/db";

function Reply({
  user_id,
  content,
  date,
  post_id,
  post_date,
  setAllPosts,
  isNewReply = false,
}: {
  user_id: string;
  content?: string;
  date?: string;
  post_id?: string;
  post_date?: string;
  setAllPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
  isNewReply?: boolean;
}) {
  const [reply, setReply] = useState<string>("");
  const { user } = useUser();

  const changeReply = (text: string) => {
    setReply(text);
  };

  const handleSubmit = async () => {
    if (!reply || !user || !setAllPosts) return;
    try {
      const response = await fetch("/api/db/addReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post_id,
          user_id: user.name,
          content: reply,
          post_date: post_date,
        }),
      });

      // console.log("Reply Successful");
      const fetchPosts = async () => {
        try {
          const response = await fetch("/api/db/post"); // Adjust the API endpoint
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }
          const data = await response.json();
          setAllPosts(data); // Set fetched posts
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
  
      fetchPosts();
      setReply("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderNameProfile = () => {
    if (isNewReply) return <></>;
    return (
      <>
        <span className="text-[12px] font-semibold cursor-pointer">
          <Username user_id={user_id} />
        </span>
        <Icons user_id={user_id} />
      </>
    );
  };

  return (
    <div className="space-y-3 mb-2">
      <div className="flex">
        <div className="flex flex-1 justify-end items-center space-x-3">
          <div className="flex items-center space-x-3">
            {renderNameProfile()}
          </div>
        </div>
      </div>
      {isNewReply ? (
        <div className="flex flex-col space-y-2">
          <textarea
            className="w-full px-2 py-2 bg-muted/15 outline outline-[0.2px] outline-muted/50 outline-offset-[-0.2px] rounded-sm overflow-y-auto break-words text-[12px] font-medium text-white/80 bg-panels max-h-[200px]"
            name="new-reply"
            placeholder="Add a reply..."
            value={reply}
            onChange={(e) => changeReply(e.target.value)}
          />
          <button
            className={`rounded py-1 text-[12px] text-background font-medium ${
              !reply ? "bg-muted" : "bg-accent"
            } transition-colors duration-200`}
            onClick={handleSubmit}
          >
            Reply
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="w-full px-2 py-2 bg-muted/15 rounded overflow-y-auto break-words text-[12px] font-medium text-white/80">
            {content}
          </div>
          <span className="text-[10px] text-muted font-medium italic mt-1">
            {date}
          </span>
        </div>
      )}
    </div>
  );
}

export default Reply;
