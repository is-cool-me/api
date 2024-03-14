const express = require("express");
const path = require("path"); // Import the path module

const app = express();

require("dotenv").config();
const port = 3000;

const Sentry = require("@sentry/node");
const bodyParser = require("body-parser");
const cors = require("cors");

Sentry.init({
    dsn: process.env.sentry_dsn,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
    ],
    tracesSampleRate: 1.0
})

const router = require("./util/router");

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use("/", router);

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
    console.log(`[API] Listening on Port: ${port}`);
});
