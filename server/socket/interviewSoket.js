import { askAI } from "../controller/auth/interview/liveInterview.js";

const interviewSessions = new Map();

function interviewSocket(socket) {
  socket.on("first-message", (data) => {
    console.log("first messsage revieved", data);

    socket.emit("comfirm-interview", {
      message: "first meesage recieved good to start interview",
    });
  });

  socket.on(
    "start-interview",
    async ({ stack = "MERN", experience = "Fresher" }) => {
      try {
        /*
                ------------------------------------------------------
                | Create Session
                ------------------------------------------------------
                */

        const session = {
          stack,

          experience,

          conversation: [
            {
              role: "system",

              content: `You are a **Senior Technical Interviewer** conducting a real-world technical interview.

### Candidate Profile

* **Tech Stack:** ${stack}
* **Experience Level:** ${experience}

### Interview Guidelines

1. Ask **only one question at a time**.
2. Always **wait for the candidate’s answer** before proceeding.
3. Ask **relevant follow-up questions** based on the candidate’s response.
4. If the answer is:

   * **Incomplete or vague** → probe deeper.
   * **Partially correct** → challenge assumptions and dig into weak areas.
   * **Incorrect** → ask guiding questions to uncover gaps (do NOT correct them directly).
5. Gradually **increase the difficulty level** as the interview progresses.
6. Focus on **practical understanding, real-world scenarios, and problem-solving ability**, not just theory.
7. Do **not provide solutions, hints, or explanations** unless explicitly instructed.
8. Keep the tone **professional, slightly challenging, and realistic**, like a real interviewer.

### Goal

Evaluate the candidate’s **depth of knowledge, clarity of thought, and ability to handle pressure**.

Start with an appropriate question based on the candidate’s experience.
`,
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
    const session = interviewSessions.get(socket.id);

    // {technicalScore : 8, communicationScore : 2, strongAreas : ["react","react-router","react-practical"], weakAreas : ["DSA","JS fundamentals","Constructor function"], roadMap : "Should practice more on DSA part for week 1 ...."}

    // Before ending the interview get a feedback, get total score out of 10, get score for communication out of 5 and return an array for strong areas and weak areas also generate a week road map
    const lastConversation = {
      role: "stystem",
      content: ` 
You are a senior technical interviewer. 
Evaluate the FULL interview transcript provided by the user.

Return ONLY valid JSON — no markdown, no explanation.

Scoring rules:
- technicalScore: integer 0-10. Base on correctness, depth, React practical, DSA, JS fundamentals.
- communicationScore: integer 0-5. Base on clarity, structure, English fluency, confidence.
- strongAreas: array of  strings (skills where candidate was solid)
- weakAreas: array of strings (skills to improve)
- roadMap: object with 7 days for week 1, each day is a specific task

JSON schema to follow exactly:
{
  "technicalScore": 8,
  "communicationScore": 2,
  "strongAreas": ["react", "react-router", "react-practical"],
  "weakAreas": ["DSA", "JS fundamentals", "Constructor function"],
  "feedback" : "You were good with explination part, theory part but should practice more on practical part in question 1 you strugged to create crud operation",
  "roadMap": {
    "day1": "DSA basics - arrays and time complexity",
    "day2": "JS fundamentals - closures and hoisting",
    "day3": "Constructor functions vs classes",
    "day4": "Practice 5 LeetCode easy array problems",
    "day5": "React practical - build small router app",
    "day6": "Mock interview - explain code out loud",
    "day7": "Review weak areas and retake quiz"
  }
}

return me result in json format 
`,
    };

    // Add last conversation into session.conversation
    session.conversation.push(lastConversation);

    // Ask ai to get complete feedback in json format

    const feedback = await askAI({ message: session.conversation });

    if (feedback) {
      // Call api to store interview details in database
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
