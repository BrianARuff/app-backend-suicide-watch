const router = require("express").Router();
const database = require("../db/pgConfig");

// all users route
router.get("/", async (req, res) => {
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const { rows: users } = await database.query("SELECT * from USERS");
    if (users.length < 1) {
      res.statusMessage = "Client side error, AKA the problem is on your computer or a connected device. Please ensure that you typed everything correctly and that are no network problems with your computer. Validate that you don't have a firewall setup to block this website. You can also try clearing the cache and doing a hard reload of the page. Please contact support if this problem continues through our \"Step-by-Step Technical Support Guide\" feature. It's mostly pictures, so it will be fun :)";
      return res.status(404).json({ statusCode: res.statusCode, message: res.statusMessage, date: loggableDate, time: loggableTime });
    } else {
      return res.status(200).json({ users });
    }
  } catch (error) {
    console.error(date, time, "Get All Users Server Error Details >> ", error.stack);
    return res.status(500).json({date: loggableDate, time: loggableTime, error: error.stack, message: "The problem is on our side. However, there are some things you can try to resolve it without going through the support process. First, try revisiting the page at a later time. It may have been an unknown error that we didn't for-see, but were able to quickly repair it without too much trouble. It's best to always report these errors to the support team via our \"Step-by-Step Technical Support Guide\" feature. It's mostly pictures, so it will be fun :)" });

  }
});

/*  Page Division Marker
=====================================================
=====================================================
=====================================================
*/

 // single user by id route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const user = await database.query("SELECT * from USERS WHERE USERS.id = $1", [id]);
    if (!user.rows[0]) {
      // setting message, don't return!!
      res.statusMessage = "Client side error, AKA the problem is on your computer or a connected device. Please ensure that you typed everything correctly and that are no network problems with your computer. Validate that you don't have a firewall setup to block this website. You can also try clearing the cache and doing a hard reload of the page. Please contact support if this problem continues through our \"Step-by-Step Technical Support Guide\" feature. It's mostly pictures, so it will be fun :)";
      return res.status(404).json({ statusCode: res.statusCode, message: res.statusMessage, date: loggableDate, time: loggableTime });
    } else {
      return res.status(200).json(user.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({date: loggableDate, time: loggableTime, error: error.stack, message: "The problem is on our side. However, there are some things you can try to resolve it without going through the support process. First, try revisiting the page at a later time. It may have been an unknown error that we didn't for-see, but were able to quickly repair it without too much trouble. It's best to always report these errors to the support team via our \"Step-by-Step Technical Support Guide\" feature. It's mostly pictures, so it will be fun :)" });

  }
});

module.exports = router;
