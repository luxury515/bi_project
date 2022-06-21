const jwt = require("jsonwebtoken");
const { JWT_SEC } = require("../config/authConfig");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SEC, (err, user) => {
      if (err) res.status(403).json("토큰이 유효하지 않습니다!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("인증되지 않았습니다!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("허용되지않는 권한! verifyTokenAndAuthorization");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("허용되지않는 권한! verifyTokenAndAdmin");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
