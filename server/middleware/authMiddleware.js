const jwt = require("jsonwebtoken");
const User = require("../schemas/User");

// Token verification
const protect = async (req, res, next) => {
  console.log("protect");
  let token;
  // Verify the correct headers sent
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // split the token from the header string
      token = req.headers.authorization.split(" ")[1];
      // decode the ID from the token using JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      // get the user from the decoded ID, without the password, and attach to the request.user
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log("token fail");
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    console.log("no token");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
