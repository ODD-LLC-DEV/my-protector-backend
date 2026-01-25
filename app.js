require("dotenv").config({ quiet: true });
require("./models/index.js")();

const path = require("node:path");
const cors = require("cors");
const express = require("express");
const { createServer } = require("node:http");

const sequelize = require("./config/db.js");
const errorHandler = require("./middlewares/error.js");
const { checkAuth } = require("./middlewares/auth.js");
const createSocketIoServer = require("./socket.js");
const checkRole = require("./middlewares/check-role.js");
const BookingJob = require("./utils/cron-job.js");

const authRoutes = require("./routes/auth.routes.js");
const guardRoutes = require("./routes/guard.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const driverRoutes = require("./routes/driver.routes.js");
const translatorRoutes = require("./routes/translator.routes.js");
const chatRoutes = require("./routes/chat.routes.js");
const userRoutes = require("./routes/user.routes.js");
const guideRoutes = require("./routes/guide.routes.js");
const customerRoutes = require("./routes/customer.routes.js");
const liveLocationRoutes = require("./routes/live-location.routes.js");

const app = express();
const server = createServer(app);

const port = process.env.PORT;

app.use(express.json());

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// App Routes
app.use("/api/auth", authRoutes);
app.use("/api/guards", guardRoutes);
app.use("/api/bookings", checkAuth, bookingRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/translators", translatorRoutes);
app.use("/api/chats", checkAuth, chatRoutes);
app.use("/api/users", checkAuth, userRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/customers", checkAuth, checkRole("Customer"), customerRoutes);
app.use("/api/live-locations", checkAuth, liveLocationRoutes);

createSocketIoServer(server);

// error handler
app.use(errorHandler);

// checks database connection
sequelize
	.authenticate()
	.then(async () => {
		console.log(">>> Connected To Database Successfully");

		// creates the tables
		await sequelize.sync();

		const job = new BookingJob();

		await job.createJobsAfterRestart();

		server.listen(port, () => {
			console.log(`>>> server is listening on port ${port}`);
		});
	})
	.catch((err) => {
		console.error(err);
	});
