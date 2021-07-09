const jwt = require("jsonwebtoken");

function RequireToken(req, res, next) {
  let token = req.headers.token;

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "not authorized",
      });
    //sent userId
    req.userId = decoded.userId;
  });
  //valid token
  next();
}
module.exports = RequireToken;
