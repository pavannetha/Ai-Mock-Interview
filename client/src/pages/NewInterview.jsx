import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../apis/interceptors";
import socket, { reconnectSocket } from "../../interviewSocket";
import { startListening, stopListening, textToSpeech } from "../utils/speech";

import aiDummy from "../assets/dummy-ai.jpeg";
import { INTERVIEW_STAGES } from "../utils/constants";

const QUESTION_TIME_SECONDS = 300;
const TOTAL_QUESTIONS = 10;

export default function NewInterview() {
  const aiContentContainer = useRef();
  const [userText, setUserText] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState(
    "Press start to begin the interview",
  );
  const [buttonText, setButtonText] = useState("Start");
  const [buttonColor, setButtonColor] = useState("bg-blue-400");
  const [isAISpeaking, setIsAIspeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [currentStage, setCurrentStage] = useState(
    INTERVIEW_STAGES.NOT_ANSWER_YET,
  );

  async function callAPi(e) {
    e.preventDefault();
    if (!userText) {
      toast("Add prompt");
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

  function resetToIdle() {
    setButtonText("Start");
    setButtonColor("bg-blue-400");
    setCurrentStage(INTERVIEW_STAGES.NOT_ANSWER_YET);
    setTimeLeft(QUESTION_TIME_SECONDS);
    setQuestionNumber(0);
    setSkippedQuestions(0);
    setCompletedQuestions(0);
  }

  function handleSubmitAnswer(skip = false) {
    if (currentStage !== INTERVIEW_STAGES.ANSWERING) {
      return;
    }

    stopListening();
    const submittedAnswer = answer.trim();

    if (skip) {
      socket.emit("skip-question");
      setSkippedQuestions((prev) => prev + 1);
      toast.info("Question skipped. It will be marked as not answered.");
    } else if (!submittedAnswer) {
      toast.info("No answer detected. The question will be marked as skipped.");
      socket.emit("skip-question");
      setSkippedQuestions((prev) => prev + 1);
    } else {
      socket.emit("submit-answer", { answer: submittedAnswer });
      setCompletedQuestions((prev) => prev + 1);
    }

    setAnswer("");
    setQuestion("Getting the next question...");
    setButtonText("Preparing...");
    setButtonColor("bg-amber-400");
    setCurrentStage(INTERVIEW_STAGES.WAITING_FOR_QUESTION);
    setTimeLeft(QUESTION_TIME_SECONDS);
  }

  function handleStartButton() {
    if (!localStorage.getItem("token")) {
      toast.error("Please login first");
      return;
    }

    if (currentStage === INTERVIEW_STAGES.NOT_ANSWER_YET) {
      reconnectSocket();
      setAnswer("");
      setQuestion("Generating your first question...");
      setButtonText("Preparing...");
      setButtonColor("bg-amber-400");
      setCurrentStage(INTERVIEW_STAGES.WAITING_FOR_QUESTION);
      socket.emit("start-interview", {
        stack: "MERN",
        difficultyLevel: "Fresher",
      });
      return;
    }

    if (currentStage === INTERVIEW_STAGES.WAITING_FOR_QUESTION) {
      return;
    }

    if (currentStage === INTERVIEW_STAGES.ANSWERING) {
      handleSubmitAnswer(false);
      return;
    }

    if (currentStage === INTERVIEW_STAGES.COMPLETED_ANSWERING) {
      resetToIdle();
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    reconnectSocket();

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on(
      "ai-question",
      ({
        question: nextQuestion,
        questionIndex,
        totalQuestions,
        timeLimitSeconds,
      }) => {
        setQuestion(nextQuestion);
        setQuestionNumber(questionIndex || 1);
        setTimeLeft(timeLimitSeconds || QUESTION_TIME_SECONDS);
        textToSpeech(nextQuestion, setIsAIspeaking);
        startListening(setAnswer);
        setButtonText("Submit");
        setButtonColor("bg-orange-400");
        setCurrentStage(INTERVIEW_STAGES.ANSWERING);
        toast.success(
          `Question ${questionIndex || 1} of ${totalQuestions || TOTAL_QUESTIONS}`,
        );
      },
    );

    socket.on("interview-complete", ({ message }) => {
      stopListening();
      setQuestion(message || "Interview complete");
      setButtonText("Completed");
      setButtonColor("bg-green-600");
      setCurrentStage(INTERVIEW_STAGES.COMPLETED_INTERVIEW);
      setTimeLeft(0);
    });

    socket.on("error", ({ message }) => {
      toast.error(message || "Interview error");
      stopListening();
      resetToIdle();
    });

    return () => {
      socket.off("connect");
      socket.off("ai-question");
      socket.off("interview-complete");
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentStage !== INTERVIEW_STAGES.ANSWERING) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStage]);

  function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  return (
    <div className="h-screen flex flex-col items-center px-4 py-4">
      <div className="flex items-center gap-4 mt-4">
        <p className="text-lg font-semibold">
          Question {questionNumber}/{TOTAL_QUESTIONS}
        </p>
        <p
          className={`${timeLeft <= 60 ? "text-red-500" : "text-black"} text-2xl font-bold`}
        >
          {formatTime(timeLeft)}
        </p>
      </div>

      {currentStage === INTERVIEW_STAGES.COMPLETED_INTERVIEW ? (
        <div className="mt-8 w-full max-w-[700px] rounded-xl border border-green-300 bg-green-50 p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-green-700">
            Interview completed
          </h3>
          <p className="mt-2 text-gray-700">
            You completed {completedQuestions} answered questions and skipped{" "}
            {skippedQuestions} question(s).
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="rounded-full bg-green-600 px-3 py-1 text-sm text-white">
              Answered: {completedQuestions}
            </span>
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm text-white">
              Skipped: {skippedQuestions}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-7 text-center">
            <img
              className={`h-60 rounded-3xl ${isAISpeaking ? "opacity-50" : "opacity-100"}`}
              src={aiDummy}
              alt="could not load the image"
            />
            <h3 className="text-xl font-bold mt-4">{question}</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mt-4 w-full max-w-[900px]">
            <textarea
              className="w-full rounded border p-3 min-h-[120px]"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak or type your answer"
              disabled={currentStage !== INTERVIEW_STAGES.ANSWERING}
            ></textarea>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleStartButton}
                disabled={
                  currentStage === INTERVIEW_STAGES.WAITING_FOR_QUESTION ||
                  currentStage === INTERVIEW_STAGES.COMPLETED_INTERVIEW
                }
                className={`p-3 ${buttonColor} border rounded text-white ${currentStage === INTERVIEW_STAGES.WAITING_FOR_QUESTION || currentStage === INTERVIEW_STAGES.COMPLETED_INTERVIEW ? "cursor-not-allowed opacity-70" : ""}`}
              >
                {buttonText}
              </button>
              <button
                onClick={() => handleSubmitAnswer(true)}
                disabled={currentStage !== INTERVIEW_STAGES.ANSWERING}
                className="p-3 bg-gray-600 rounded text-white disabled:opacity-50"
              >
                Skip
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
