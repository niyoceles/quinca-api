class orderValidations {
	static async validateOrder(req, res, next) {
		const { startDate, endDate } = req.body;

		switch (true) {
			case startDate === null || startDate === undefined:
				return res.status(400).json({
					error: 'starting date is required',
				});

			case endDate === null || endDate === undefined:
				return res.status(400).json({
					error: 'ending date is required',
				});
		}

		next();
	}

	static async validateOrderId(req, res, next) {
		const { id } = req.params;

		switch (true) {
			case id === null || id === undefined:
				return res.status(400).json({
					error: 'Order id is required',
				});
		}

		next();
	}
}

export default orderValidations;
