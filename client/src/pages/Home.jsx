import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../apis/interceptors";

export default function Home() {
  // const aiResponse =
  //   'Here\'s "hello" in Telugu and Spanish:\n\n*   **Telugu:** Namaskaram (నమస్కారం)\n*   **Spanish:** Hola';
  const aiContentContainer = useRef();
  const [userText, setUserText] = useState("");

  async function callAPi(e) {
    e.preventDefault();
    if (!userText) {
      toast("Add promt");
      return;
    }
    try {
      const response = await api.post("/interview/liveInterview", {
        prompt: userText,
      });
      aiContentContainer.current.innerText = response?.data?.data;
    } catch (err) {
      toast.error(err.message);
    }
  }

  // useEffect(() => {
  //   aiContentContainer.current.innerText = aiResponse;
  // }, []);

  return (
    <form onSubmit={callAPi}>
      <div className="flex justify-center mt-3 gap-1">
        <input
          type="text"
          className="w-80 shadow-2xl border-1 p-1.5 rounded"
          placeholder="Ask AI"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />
        <input
          type="submit"
          value="Submit"
          className={`${!userText.length ? "bg-blue-200" : "bg-blue-400"}  shadow-2xl text-white border-1 p-1.5 rounded`}
          disabled={!userText.length ? true : false}
        />
      </div>
      <div ref={aiContentContainer}></div>
    </form>
  );
}
