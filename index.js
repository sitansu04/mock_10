const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db.js");
const { userRoute } = require("./routes/user.routes.js");
const { auth } = require("./middlewares/auth.middleware.js");
const app = express();

app.use(cors());
app.use(express.json());


//---------------------------------Routers----------------------->
app.use("/users", userRoute);


//------------------------------Checking Server-------------------->
app.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: `Welconme to Chat App Backend` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

//----------------------------Port Connection-------------------------->
app.listen(8080, async () => {
  try {
    await connection;
  } catch (error) {
    console.log(error);
  }
  console.log("Connected with DB and port 8000");
});
