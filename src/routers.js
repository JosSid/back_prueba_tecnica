const router = require("express").Router();

const user = require("./routers/userRouter");

router.use("/api/user", user);

module.exports = router;
