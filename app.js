const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const path = require("node:path");
const session = require("express-session");

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Express session for storing admin password
app.use(
    session({
        secret: process.env.SESSION_SECRET || "devsecret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/", indexRouter);

// EJS handling
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static assets handling
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Error middleware function
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
