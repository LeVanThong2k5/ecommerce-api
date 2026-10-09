import {
  findUserByUsername,
  registerUser,
  comparePassword,
  generateToken
} from "../services/auth.service.js";

function sanitizeUser(user) {
  return {
    uid: user.uid,
    username: user.username,
    fullname: user.fullname,

    role: {
      roleid: user.role.roleid,
      rolename: user.role.rolename
    },

    membership: {
      mid: user.membership.mid,
      mname: user.membership.mname,
      score: user.membership.score
    }
  };
}

export async function register(req, res) {
  try {
    let {
      username,
      fullname,
      password
    } = req.body;

    if (!username || !fullname || !password) {
      return res.status(400).json({
        success: false,
        message:
          "username, fullname and password are required"
      });
    }

    username = username.trim();
    fullname = fullname.trim();

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters"
      });
    }

    const existingUser =
      await findUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists"
      });
    }

    const user = await registerUser({
      username,
      fullname,
      password
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Register successfully",
      data: {
        user: sanitizeUser(user),
        token
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot register user"
    });
  }
}

export async function login(req, res) {
  try {
    let {
      username,
      password
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required"
      });
    }

    username = username.trim();

    const user =
      await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const passwordMatched =
      await comparePassword(
        password,
        user.password
      );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        user: sanitizeUser(user),
        token
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot login"
    });
  }
}