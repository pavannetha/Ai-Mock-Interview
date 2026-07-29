import {
  askAI,
  getFeedbackFromAI,
} from "../controller/auth/interview/liveInterview.js";
import {
  endInterviewSystemPrompt,
  startInterviewSystemPrompt,
} from "../Utils/prompts.js";
import { saveInterviewToDatabase } from "../Utils/interviewStorage.js";

const interviewSessions = new Map();
const MAX_QUESTIONS = 10;
const QUESTION_TIME_SECONDS = 300;

function interviewSocket(socket) {
  // socket.on("first-message", (data) => {
  //   console.log("first messsage revieved", data);

  //   socket.emit("comfirm-interview", {
  //     message: "first meesage recieved good to start interview",
  //   });
  // });

  const userId = socket.userId;

  socket.on(
    "start-interview",
    async ({ stack = "MERN", difficultyLevel = "Fresher" }) => {
      try {
        /*
     ------------------------------------------------------
    | Create Session
     ------------------------------------------------------
     */

        const session = {
          userId,
          stack,
          difficultyLevel,
          startedAt: new Date(),
          currentQuestionIndex: 0,
          completedQuestions: 0,
          conversation: [
            {
              role: "system",

              content: startInterviewSystemPrompt(stack, difficultyLevel),
            },
          ],
        };

        // Store conversation with socket id (to identify unique clients sockets)
        interviewSessions.set(socket.id, session);

        /*
                ------------------------------------------------------
                | Generate First Question
                ------------------------------------------------------
                */

        const firstQuestion = await askAI({
          messages: session.conversation,
        });

        /*
                ------------------------------------------------------
                | Save AI Question
                ------------------------------------------------------
                */

        session.currentQuestionIndex = 1;
        session.conversation.push({
          role: "assistant",

          content: firstQuestion,
        });

        socket.emit("ai-question", {
          question: firstQuestion,
          questionIndex: session.currentQuestionIndex,
          totalQuestions: MAX_QUESTIONS,
          timeLimitSeconds: QUESTION_TIME_SECONDS,
        });
      } catch (err) {
        console.log(err);

        socket.emit("error", {
          message: err.message,
        });
      }
    },
  );

  /*
    |--------------------------------------------------------------------------
    | USER ANSWER
    |--------------------------------------------------------------------------
    */

  socket.on("submit-answer", async ({ answer }) => {
    try {
      const session = interviewSessions.get(socket.id);

      if (!session) return;

      session.conversation.push({
        role: "user",
        content: answer || "No answer provided",
      });

      session.completedQuestions += 1;

      if (session.completedQuestions >= MAX_QUESTIONS) {
        await finishInterview(socket, session);
        return;
      }

      const nextQuestion = await askAI({
        messages: session.conversation,
      });

      session.currentQuestionIndex += 1;
      session.conversation.push({
        role: "assistant",
        content: nextQuestion,
      });

      socket.emit("ai-question", {
        question: nextQuestion,
        questionIndex: session.currentQuestionIndex,
        totalQuestions: MAX_QUESTIONS,
        timeLimitSeconds: QUESTION_TIME_SECONDS,
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("skip-question", async () => {
    try {
      const session = interviewSessions.get(socket.id);

      if (!session) return;

      session.conversation.push({
        role: "user",
        content: "Skipped question - not answered",
      });

      session.completedQuestions += 1;

      if (session.completedQuestions >= MAX_QUESTIONS) {
        await finishInterview(socket, session);
        return;
      }

      const nextQuestion = await askAI({
        messages: session.conversation,
      });

      session.currentQuestionIndex += 1;
      session.conversation.push({
        role: "assistant",
        content: nextQuestion,
      });

      socket.emit("ai-question", {
        question: nextQuestion,
        questionIndex: session.currentQuestionIndex,
        totalQuestions: MAX_QUESTIONS,
        timeLimitSeconds: QUESTION_TIME_SECONDS,
      });
    } catch (err) {
      console.log(err);
    }
  });

  /*
    |--------------------------------------------------------------------------
    | VIEW CONVERSATION
    |--------------------------------------------------------------------------
    |
    | Useful for debugging
    |
    */

  // socket.on(
  //     "get-conversation",
  //     () => {

  //         const session =
  //             interviewSessions.get(
  //                 socket.id
  //             )

  //         socket.emit(
  //             "conversation-data",

  //             session?.conversation ||
  //             []
  //         )
  //     }
  // )

  /*
    |--------------------------------------------------------------------------
    | END INTERVIEW
    |--------------------------------------------------------------------------
    */

  socket.on("end-interview", async () => {
    const session = interviewSessions.get(socket.id);

    if (!session) {
      return;
    }

    await finishInterview(socket, session);
  });

  /*
    |--------------------------------------------------------------------------
    | DISCONNECT
    |--------------------------------------------------------------------------
    */

  socket.on("disconnect", () => {
    interviewSessions.delete(socket.id);

    console.log("Disconnected:", socket.id);
  });
}

export default interviewSocket;

async function finishInterview(socket, session) {
  const lastConversation = {
    role: "system",
    content: endInterviewSystemPrompt(),
  };
  session.endedAt = new Date();
  session.conversation.push(lastConversation);

  const feedback = await getFeedbackFromAI({
    messages: session.conversation,
  });

  if (feedback) {
    try {
      await saveInterviewToDatabase(feedback, session);
    } catch (error) {
      console.error("Failed to save interview to database", error);
    }
  }

  socket.emit("interview-complete", {
    message: "Interview complete. You answered 10 questions.",
  });

  interviewSessions.delete(socket.id);
}
