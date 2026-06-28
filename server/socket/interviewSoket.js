import {
  askAI,
  getFeedbackFromAI,
} from "../controller/auth/interview/liveInterview.js";
import {
  endInterviewSystemPrompt,
  startInterviewSystemPrompt,
} from "../Utils/prompts.js";

const interviewSessions = new Map();

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

        session.conversation.push({
          role: "assistant",

          content: firstQuestion,
        });

        socket.emit("ai-question", {
          question: firstQuestion,
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

      /*
                ------------------------------------------------------
                | Save User Answer For Maintaining History Of Conversation
                ------------------------------------------------------
                */

      // [{role : "system", content : "You are a senior softwer.."}, {role : "assistant", content : "What is javascript"}, {role : "user", content : "Javascript is a single threaded la..."}]

      session.conversation.push({
        role: "user",

        content: answer,
      });

      /*
                ------------------------------------------------------
                | Ask Next Question
                ------------------------------------------------------
                */

      const nextQuestion = await askAI({
        messages: session.conversation,
      });

      /*
                ------------------------------------------------------
                | Save AI Question
                ------------------------------------------------------
                */

      session.conversation.push({
        role: "assistant",

        content: nextQuestion,
      });

      socket.emit("ai-question", {
        question: nextQuestion,
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
    console.log("interview is ending");
    const session = interviewSessions.get(socket.id);

    if (!session) {
      return;
    }

    // {technicalScore : 8, communicationScore : 2, strongAreas : ["react","react-router","react-practical"], weakAreas : ["DSA","JS fundamentals","Constructor function"], roadMap : "Should practice more on DSA part for week 1 ...."}

    // Before ending the interview get a feedback, get total score out of 10, get score for communication out of 5 and return an array for strong areas and weak areas also generate a week road map
    const lastConversation = {
      role: "stystem",
      content: endInterviewSystemPrompt(),
    };
    session.endedAt = new Date();
    // Add last conversation into session.conversation
    session.conversation.push(lastConversation);

    // Ask ai to get complete feedback in json format

    const feedback = await getFeedbackFromAI({ message: session.conversation });

    if (feedback) {
      // store interview details in database
      await addInterview(feedback);
    }

    console.log("Final Conversation:");

    console.log(session?.conversation);

    interviewSessions.delete(socket.id);
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

async function addInterview() {
  // Take json from ai verify it with schema
  // Then create a new object and pass all details to it (object should be mathcing with Interview model schema)
  // Tag userId, stack, difficultyLevel, conversation, startedAt and endedAt
  // Once complete object is created for Interview model then add it in database
}

/*
1. Complete addInterview function
2. Create api to get interview details from Interview model based on userId
3. Show interview details in dashboard 


Reference for picharts

https://www.npmjs.com/package/react-chartjs-2#docs

*/
