import { user } from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { genarateJwtToken } from "../../Utils/genarateJwtToken.js";

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }
    const userExist = await user.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "user does not exist" });
    }
    const match = await bcrypt.compare(password, userExist.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect Passsword" });
    }
    let token = genarateJwtToken({
      email: userExist.email,
      userId: userExist._id,
    });

    const userDetails = {
      name: userExist.name,
      email: userExist.email,
      dob: userExist.dob,
      phone: userExist.phone,
    };
    res.status(200).json({ message: "user Logged In", userDetails, token });
  } catch (error) {
    console.log(error.message);
  }
}
