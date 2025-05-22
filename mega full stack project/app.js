import express from "express"
const app = express();
import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"

app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/users",authRouter)
export default app;