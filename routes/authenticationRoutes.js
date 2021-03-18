require("dotenv").config();

const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenGenerator = require("../JWT/token-generator");
const uuid = require("uuid/v4");
const cors = require("cors");
router.use(cors());

//==============================
/*==========REGISTER==========*/
// ==============================
router.post("/register", async (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const date = new Date();
    const loggableDate = date.toLocaleDateString();
    const loggableTime = date.toLocaleTimeString();

    const {name, email, date_of_birth, description, image, friends, role} = req.body;

    let {password} = req.body;

    const isValidEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)

    if (!isValidEmail) {
        return res.status(403).json({message: "Invalid email"});
    }

    // TODO send proper message when name/email is already in use than what we have now...

    // Extra protection from adding Admin Users
    if (role === "admin") {
        if (req.header("admin-secret") !== process.env.ADMIN_SECRET) {
            return res.status(403).json({message: "Invalid credientials to create admin accounts"})
        }
    }
    console.log("psw before hash", password);
    if (password) {
        const salt = await bcryptjs.genSalt(12);
        password = await bcryptjs.hash(password, salt);
    } else {
        console.error(new Error("Invalid password Error @ path:/auth/register"))
        return res.status(403).json({message: "Invalid Password. Please try again."});
    }

    console.log("psw after hash", password);

    try {
        const usersInsert = await database.query("INSERT into users ( name, password, email, date_of_birth, role, description, image, friends ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *", [
            name,
            password,
            email,
            date_of_birth,
            role,
            description,
            image,
            "{}"
        ]).then(t => {
            console.log(t);
        })

        usersInsert();

        const userRawData = database.query("SELECT * FROM users WHERE users.name = $1", [name]);
        console.log(userRawData);
        const user = {
            id: userRawData.rows[0].id,
            name: userRawData.rows[0].name,
            email: userRawData.rows[0].email,
            date_of_birth: userRawData.rows[0].date_of_birth,
            description: userRawData.rows[0].description,
            role: userRawData.rows[0].role,
            created_at: userRawData.rows[0].created_at,
            updated_at: userRawData.rows[0].updated_at
        }

        const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET, process.env.JWT_PUBLIC, {
            algorithm: 'HS256', keyid: uuid(), noTimestamp: false,
            expiresIn: '2m', notBefore: '2s'
        });
        const token = tokenGenerator.sign(user);

        return res.status(200).json({user, token, image});

    } catch (error) {
        return res.status(500).json({error: formatPGErrors(error), date: loggableDate, time: loggableTime});
    }
});

// ==============================
/* ========== LOGIN ========== */
// ==============================
router.post("/login", async (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const {password, name, email} = req.body;
    try {
        const user = await database.query("SELECT * FROM users WHERE users.name = $1 OR users.email = $1", [
            name || email
        ]);

        delete user.rows[0].image;

        if (!user.rows[0]) {
            return res.status(403).json({message: "Invalid login credentials."});
        }

        const isValidPassword = await bcryptjs.compareSync(password, user.rows[0].password);

        if ((user.rows[0].name === name || user.rows[0].email === email) && isValidPassword) {

            const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET, process.env.JWT_PUBLIC, {
                algorithm: 'HS256', keyid: uuid(), noTimestamp: false,
                expiresIn: '2m', notBefore: '2s'
            });

            const token = tokenGenerator.sign(user.rows[0]);

            return res.status(200).json({userData: user.rows[0], token});

        } else {
            return res.status(403).json({message: "Invalid login credentials"});
        }
    } catch (error) {
        return res.status(500).json(formatPGErrors(error));
    }
});

module.exports = router;