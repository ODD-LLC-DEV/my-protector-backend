const { CronJob } = require("cron");
const BookingCronJob = require("../models/Booking-Cron-Job");
const Booking = require("../models/Booking");
const sequelize = require("../config/db");

class BookingJob {
	constructor() {
		this.jobs = new Map();
	}

	async init(date, time, booking_id, transaction) {
		const formatedDate = new Date(`${date} ${time}`);

		formatedDate.toLocaleString("en-US", {
			timeZone: "Africa/Cairo",
		});

		const newJob = CronJob.from({
			cronTime: `${formatedDate.getMinutes()} ${formatedDate.getHours()} ${formatedDate.getDate()} ${formatedDate.getMonth() + 1} *`,
			onTick: async () => {
				await this.bookingCronFunction(booking_id);
			},
			start: true,
		});

		this.jobs.set(booking_id, newJob);

		console.log(formatedDate);

		if (transaction) {
			await this.saveTheCronJob(formatedDate, booking_id, transaction);
		}
	}

	async bookingCronFunction(booking_id) {
		await sequelize.transaction(async (transaction) => {
			await Booking.update(
				{
					status: "Finished",
				},
				{
					where: {
						id: booking_id,
					},
					transaction,
				},
			);

			await BookingCronJob.destroy({
				where: {
					booking_id: booking_id,
				},
				transaction,
			});
		});

		const job = this.jobs.get(booking_id);

		await job.stop();
	}

	async saveTheCronJob(date, booking_id, transaction) {
		await BookingCronJob.create(
			{
				job_date: date,
				booking_id: booking_id,
			},
			{
				transaction,
			},
		);
	}

	async createJobsAfterRestart() {
		const jobs = await BookingCronJob.findAll({
			raw: true,
		});

		for (const job of jobs) {
			await this.init(job.cron_date, job.booking_id, undefined);
		}
	}
}

module.exports = BookingJob;
