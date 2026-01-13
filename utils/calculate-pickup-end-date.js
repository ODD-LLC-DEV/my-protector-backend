function calculatePickupEndDate(protection_duration, pickup_date) {
	const [duration_str, duration_period] = protection_duration.split(" ");
	const duration_number = parseInt(duration_str, 10);

	let addition;

	switch (duration_period) {
		case "weeks":
		case "week":
			addition = duration_number * 7;
			break;
		case "days":
		case "day":
			addition = duration_number;
			break;
		case "months":
		case "month":
			addition = duration_number * 30;
			break;
	}

	const endDate = new Date(`${pickup_date}`);

	endDate.setDate(endDate.getDate() + addition);

	return endDate;
}

module.exports = calculatePickupEndDate;
