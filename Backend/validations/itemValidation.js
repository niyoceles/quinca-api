class itemValidations {
  static async validateItem(req, res, next) {
    const {
      itemName,
      itemImage,
      itemDescription,
      itemPrice,
      status
    } = req.body;

    switch (true) {
      case itemName === null || itemName === undefined:
        return res.status(400).json({
          error: 'item name is required'
        });

      case itemImage === null || itemImage === undefined:
        return res.status(400).json({
          error: 'item image is required'
        });

      case itemDescription === null || itemDescription === undefined:
        return res.status(400).json({
          error: 'item description is required'
        });

      case itemPrice === null || itemPrice === undefined:
        return res.status(400).json({
          error: 'Item price is required'
        });

      case status === null || status === undefined:
        return res.status(400).json({
          error: 'status is required'
        });
    }

    next();
  }

  static async validateItemId(req, res, next) {
    const {
      id
    } = req.params;

    switch (true) {
      case id === null
            || id === undefined:
        return res.status(400).json({
          error: 'item id is required'
        });
    }

    next();
  }
}

export default itemValidations;
