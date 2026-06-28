import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../apis/interceptors";
import socket from "../../interviewSocket";
import { startListening, stopListening, textToSpeech } from "../utils/speech";
2;
import aiDummy from "../assets/dummy-ai.jpeg";
import { INTERVIEW_STAGES } from "../utils/constants";

export default function Home() {
  // const aiResponse =
  //   'Here\'s "hello" in Telugu and Spanish:\n\n*   **Telugu:** Namaskaram (నమస్కారం)\n*   **Spanish:** Hola';
  const aiContentContainer = useRef();
  const [userText, setUserText] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("First Question");
  const [buttonText, setButtonText] = useState("Start");
  const [buttonColor, setButtonColor] = useState("bg-blue-400");
  const [isAISpeaking, setIsAIspeaking] = useState(false);
  const [timer, setTimer] = useState(1.1 * 60);
  const [isLastMinute, setIsLastMinute] = useState(false);
  const [currentStage, setCurrentStage] = useState(
    INTERVIEW_STAGES.NOT_ANSWER_YET,
  );

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

  function socketFirstMsg() {
    socket.emit("first-message", { message: "start intterview" });
  }

  function handleStartButton() {
    if (currentStage == INTERVIEW_STAGES.NOT_ANSWER_YET) {
      startListening(setAnswer);
      setButtonText("stop");
      setCurrentStage(INTERVIEW_STAGES.ANSWERING);
      setButtonColor("bg-orange-400");
    }
    if (currentStage == INTERVIEW_STAGES.ANSWERING) {
      stopListening();
      setButtonText("Submit");
      setCurrentStage(INTERVIEW_STAGES.COMPLETED_ANSWERING);
      setButtonColor("bg-green-400");
    }
    if (currentStage == INTERVIEW_STAGES.COMPLETED_ANSWERING) {
      setButtonText("Start");
      setAnswer("");
      setCurrentStage(INTERVIEW_STAGES.NOT_ANSWER_YET);
      setButtonColor("bg-blue-400");
    }
  }

  useEffect(() => {
    socket.connect();
    socket.on("comfirm-interview", (data) => {
      console.log("data from socket serverrr", data);
      if ((data.message, setIsAIspeaking)) {
        textToSpeech(data.message);
      }
    });

    //

    // return () => {
    //   console.log("socket disssconted");
    //   socket.off("comfirm-interview");
    //   socket.disconnect
    // };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 60) {
          socket.emit("end-interview");
          setIsLastMinute(true);
        }

        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" h-screen flex flex-col items-center">
      <p
        className={`${isLastMinute ? "text-red-500" : "text-black"} text-2xl font-bold`}
      >
        {timer}
      </p>
      {/* <form onSubmit={callAPi}>
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
      <button onClick={socketFirstMsg}>first message</button>
      <br />
      <button onClick={() => startListening(setAnswer)}>Start Listening</button>
      <br />
      <button onClick={stopListening}>stop Listening</button>

      <div>
        <textarea
          className="w-[400px] h-[250px] border"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>
      </div> */}
      <div className="mt-7">
        <img
          className={`h-60 rounded-3xl ${isAISpeaking ? "opacity-50" : "opacity-100"}`}
          src={aiDummy}
          alt="could not load the image"
        />
        <h3 className="text-xl font-bold">{question}</h3>
      </div>
      <div className="flex gap-2">
        <textarea
          className="w-[700px] rounded border"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>
        <div>
          <button
            onClick={handleStartButton}
            className={`p-3 ${buttonColor} border-1 rounded text-white`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
