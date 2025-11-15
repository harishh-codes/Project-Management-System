import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser";
const app = express();

// WINSTON MORGON LOGGER

import logger from "../logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// app.use -> middlewares

// basic configuration
app.use(express.json({ limit:"16kb" }))
app.use(express.urlencoded({ extended:true , limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieparser())

// Cors configuration
app.use(
    cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTION"],
    allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

// import the routes

import healthCheckRouter from "./routes/healthcheck.router.js"
import authRouter from "./routes/auth.router.js"
import projectRouter from "./routes/project.router.js"
import taskRouter from "./routes/task.router.js"
import userRouter from "./routes/user.router.js"
import activityLogRouter from "./routes/activityLog.router.js"

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/activity-logs", activityLogRouter)

app.get("/", (req,res) => {
    res.send("Welcome to Basecampy!")
})

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || [];

    res.status(status).json({
        statusCode: status,
        data: null,
        message: message,
        success: false,
        errors: errors,
    });
});

export default app;