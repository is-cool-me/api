// Load environment variables first
require("dotenv").config();

// Initialize Sentry before any other imports
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.sentry_dsn,
    integrations: [
        Sentry.httpIntegration({ tracing: true }),
        Sentry.expressIntegration(),
    ],
    tracesSampleRate: 1.0
})

// Now import other modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

const router = require("./util/router");

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use("/", router);

Sentry.setupExpressErrorHandler(app);

app.listen(port, () => {
    console.log(`[API] Listening on Port: ${port}`);
});
