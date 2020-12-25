class authValidations {
  static async validateSignupClient(req, res, next) {
    const {
      names, phoneNumber, email, password
    } = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const pwdRegex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
    let phoneRegex;
    if (phoneNumber === undefined) {
      phoneRegex = /^\w+$/;
    } else if (phoneNumber === '') {
      phoneRegex = /^[0-9]*$/;
    } else {
      phoneRegex = /^\+2507(?:[0-9] ?){7,7}[0-9]$/;
    }

    switch (true) {
      case names.length < 3 || names.length > 25 || typeof names === 'number':
        return res.status(400).json({
          error: [
            'Full name should not have less than 3 characters',
            'Full name should not have more than 25 characters',
            'Full name should not be numeric',
          ],
        });

      case phoneNumber === null || phoneNumber === undefined:
        return res.status(400).json({
          error: 'A valid phone number is required',
        });

      case phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250.........',
        });

      case emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g martinez@yahoo.com',
        });

      case pwdRegex.test(password) === false:
        return res.status(400).json({
          error: [
            'a valid password should not be alphanumeric',
            'a valid password should have atleast a digit, a special character and an uppercase letter',
            'a valid password should not be alphanumeric',
            'a valid password should be 8 characters long',
            'an example of a valid password is Explorer@47',
          ],
        });
    }

    next();
  }

  static async validateUpdateUser(req, res, next) {
    const {
      names, phoneNumber, email
    } = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let phoneRegex;
    if (phoneNumber === undefined) {
      phoneRegex = /^\w+$/;
    } else if (phoneNumber === '') {
      phoneRegex = /^[0-9]*$/;
    } else {
      phoneRegex = /^\+2507(?:[0-9] ?){7,7}[0-9]$/;
    }

    switch (true) {
      case names.length < 3 || names.length > 25 || typeof names === 'number':
        return res.status(400).json({
          error: [
            'Full name should not have less than 3 characters',
            'Full name should not have more than 25 characters',
            'Full name should not be numeric',
          ],
        });

      case phoneNumber === null || phoneNumber === undefined:
        return res.status(400).json({
          error: 'A valid phone number is required',
        });

      case phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250.........',
        });

      case emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g martinez@yahoo.com',
        });
    }

    next();
  }

  static async validateSignupSupplier(req, res, next) {
    const {
      names,
      phoneNumber,
      email,
      nationalId,
      organization,
      description,
      country,
      state,
      city,
      address,
      location,
      password,
    } = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const pwdRegex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
    let phoneRegex;
    if (phoneNumber === undefined) {
      phoneRegex = /^\w+$/;
    } else if (phoneNumber === '') {
      phoneRegex = /^[0-9]*$/;
    } else {
      phoneRegex = /^\+2507(?:[0-9] ?){7,7}[0-9]$/;
    }

    switch (true) {
      case names === null || names === undefined:
        return res.status(400).json({
          error: 'Your names are required',
        });

      case names.length < 3 || names.length > 25 || typeof names === 'number':
        return res.status(400).json({
          error: [
            'Full name should not have less than 3 characters',
            'Full name should not have more than 25 characters',
            'Full name should not be numeric',
          ],
        });

      case phoneNumber === null || phoneNumber === undefined:
        return res.status(400).json({
          error: 'A valid phone number is required',
        });

      case nationalId === null || nationalId === undefined:
        return res.status(400).json({
          error: 'Your national ID is required',
        });

      case organization === null || organization === undefined:
        return res.status(400).json({
          error: 'organization is required',
        });

      case description === null || description === undefined:
        return res.status(400).json({
          error: 'description is required',
        });

      case country === null || country === undefined:
        return res.status(400).json({
          error: 'Your country is required',
        });

      case state === null || state === undefined:
        return res.status(400).json({
          error: 'state is required',
        });
      case city === null || city === undefined:
        return res.status(400).json({
          error: 'City is required',
        });
      case address === null || address === undefined:
        return res.status(400).json({
          error: 'Address is required',
        });

      case location === null || location === undefined:
        return res.status(400).json({
          error: 'location is required',
        });

      case phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250.........',
        });

      case emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g martinez@yahoo.com',
        });

      case pwdRegex.test(password) === false:
        return res.status(400).json({
          error: [
            'a valid password should not be alphanumeric',
            'a valid password should have atleast a digit, a special character and an uppercase letter',
            'a valid password should not be alphanumeric',
            'a valid password should be 8 characters long',
            'an example of a valid password is YourPassword@47',
          ],
        });
    }

    next();
  }
}

export default authValidations;
