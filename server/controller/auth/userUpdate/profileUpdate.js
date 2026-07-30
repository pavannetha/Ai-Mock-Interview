import { user } from "../../../models/userModel.js";

export async function profileUpdate(req, res) {
  let userId = req.user.userId;
  const body = req.body;

  try {
    if (body.password) {
      delete body.password;
    }
    if (body.email) {
      delete body.email;
    }
    const updatedUser = await user
      .findByIdAndUpdate(userId, body, {
        returnDocument: "after",
        runValidators: true,
      })
      .select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: `User not found` });
    }
    return res.status(201).json({ message: "ok", updatedUser });
  } catch (err) {}
}
