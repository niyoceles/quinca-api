class orderValidations {
  static async validateOrder(req, res, next) {
    const {
      needDate, deadline
    } = req.body;

    switch (true) {
      case needDate === null || needDate === undefined:
        return res.status(400).json({
          error: 'date items needed is required',
        });

      case deadline === null || deadline === undefined:
        return res.status(400).json({
          error: 'deadline date is required',
        });
    }

    next();
  }

  static async validateOrderId(req, res, next) {
    const {
      id
    } = req.params;

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
