import express from "express";
import {
	createTicket,
	deleteTicket,
	fetchTicketDetails,
	fetchTickets,
	seedSampleData,
	updateTicket,
} from "../controllers/ticketController";
const router = express.Router();
router.post("/create", createTicket);
router.post("/seed", seedSampleData);
router.get("/", fetchTickets);
router.get("/:id", fetchTicketDetails);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);
export default router;
