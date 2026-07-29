import { Interview } from "../models/Interview.js";

function normalizeInterviewPayload(aiResponse, session) {
  let parsedPayload = null;

  if (typeof aiResponse === "string") {
    try {
      parsedPayload = JSON.parse(aiResponse);
    } catch {
      parsedPayload = null;
    }
  } else if (aiResponse && typeof aiResponse === "object") {
    parsedPayload = aiResponse;
  }

  const payload = parsedPayload || {};

  return {
    userId: session.userId,
    stack: session.stack,
    difficultyLevel: session.difficultyLevel,
    technicalScore: Number(payload.technicalScore ?? 0),
    communicationSCore: Number(
      payload.communicationScore ?? payload.communicationSCore ?? 0,
    ),
    strongAreas: Array.isArray(payload.strongAreas) ? payload.strongAreas : [],
    weakAreas: Array.isArray(payload.weakAreas) ? payload.weakAreas : [],
    feedback:
      payload.feedback || aiResponse || "Interview completed successfully.",
    conversation: Array.isArray(session.conversation)
      ? session.conversation
      : [],
    startedAt: session.startedAt,
    endedAt: session.endedAt,
  };
}

async function saveInterviewToDatabase(aiResponse, session) {
  const interviewDocument = normalizeInterviewPayload(aiResponse, session);
  return Interview.create(interviewDocument);
}

export { normalizeInterviewPayload, saveInterviewToDatabase };
