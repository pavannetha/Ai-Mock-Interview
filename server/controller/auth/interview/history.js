import { Interview } from "../../../models/Interview.js";

export async function history(req, res) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const interviews = await Interview.find({ userId }).sort({ startedAt: -1 });

    return res.status(200).json({ interviews });
  } catch (error) {
    console.error("Failed to fetch interview history", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch interview history" });
  }
}
