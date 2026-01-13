async function bulkCreateWithBooking(
	model,
	bookingId,
	data,
	foreignKey,
	transaction,
) {
	if (!data || data.length === 0) {
		return;
	}

	const insertedData = data.map((id) => ({
		booking_id: bookingId,
		[foreignKey]: id,
	}));

	await model.bulkCreate(insertedData, { transaction });
}

module.exports = bulkCreateWithBooking;
