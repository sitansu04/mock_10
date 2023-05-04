const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(400).send({ msg: `Token not Found` });
    } else {
      try {
        const decoded = jwt.verify(token, "sitansu");
        if(!decoded){
            return res.status(400).send({ msg: `Token is not Valid` });
        }
        if (decoded) {
            // console.log(decoded)
          const status = decoded.status;
          if (status === "NotVerified") {
            return res
              .status(400)
              .send({ msg: `Please Veriry yourself first` });
          } else {
            next();
          }
        } else {
          return res.status(400).send({ msg: `Token is not Valid` });
        }
      } catch (error) {}
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  auth,
};
