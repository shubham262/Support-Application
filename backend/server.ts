import "dotenv/config";
import express from "express";
import ticketRoutes from "./src/routes/tickets";
import commentRoutes from "./src/routes/comments";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/tickets", ticketRoutes);
app.use("/comments", commentRoutes);
app.listen(3000, () => {
	console.log("server started at port 3000");
});
