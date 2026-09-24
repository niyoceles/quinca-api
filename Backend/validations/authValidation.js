class authValidations {
  static async validateSignupClient(req, res, next) {
    const {
      names, email, password
    } = req.body;
    let { phoneNumber } = req.body;

    if (typeof phoneNumber === 'string') {
      let cleaned = phoneNumber.trim().replace(/[\s-]/g, '');
      if (/^07[2389]\d{7}$/.test(cleaned)) {
        cleaned = `+25${cleaned}`;
      } else if (/^2507[2389]\d{7}$/.test(cleaned)) {
        cleaned = `+${cleaned}`;
      }
      req.body.phoneNumber = cleaned;
      phoneNumber = cleaned;
    }

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

      case typeof names === 'number' || (typeof names === 'string' && (names.trim().length < 3 || names.trim().length > 60)):
        return res.status(400).json({
          error: [
            'Full name should not have less than 3 characters',
            'Full name should not have more than 60 characters',
            'Full name should not be numeric',
          ],
        });

      case phoneNumber === null || phoneNumber === undefined || phoneNumber === '':
        return res.status(400).json({
          error: 'A valid phone number is required',
        });

      case phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250.........',
        });

      case !email || emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g martinez@yahoo.com',
        });

      case !password || pwdRegex.test(password) === false:
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
      names, email
    } = req.body;
    let { phoneNumber } = req.body;

    if (typeof phoneNumber === 'string') {
      let cleaned = phoneNumber.trim().replace(/[\s-]/g, '');
      if (/^07[2389]\d{7}$/.test(cleaned)) {
        cleaned = `+25${cleaned}`;
      } else if (/^2507[2389]\d{7}$/.test(cleaned)) {
        cleaned = `+${cleaned}`;
      }
      req.body.phoneNumber = cleaned;
      phoneNumber = cleaned;
    }

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
      case names && (typeof names === 'number' || names.length < 3 || names.length > 60):
        return res.status(400).json({
          error: [
            'Full name should not have less than 3 characters',
            'Full name should not have more than 60 characters',
            'Full name should not be numeric',
          ],
        });

      case phoneNumber !== undefined && phoneRegex.test(phoneNumber) === false:
        return res.status(400).json({
          error: 'Provide a valid phone number, i.e:+250.........',
        });

      case email && emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g martinez@yahoo.com',
        });
    }

    next();
  }

  static async validateSignupSupplier(req, res, next) {
    const {
      names,
      email,
      nationalId,
      organization,
      description,
      country,
      city,
      address,
      location,
      password,
    } = req.body;
    let { phoneNumber } = req.body;

    if (typeof phoneNumber === 'string') {
      let cleaned = phoneNumber.trim().replace(/[\s-]/g, '');
      if (/^07[2389]\d{7}$/.test(cleaned)) {
        cleaned = `+25${cleaned}`;
      } else if (/^2507[2389]\d{7}$/.test(cleaned)) {
        cleaned = `+${cleaned}`;
      }
      req.body.phoneNumber = cleaned;
      phoneNumber = cleaned;
    }

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

      case typeof names === 'number' || (typeof names === 'string' && (names.trim().length < 3 || names.trim().length > 60)):
        return res.status(400).json({
          error: [
            'Full name should not have less than 3 characters',
            'Full name should not have more than 60 characters',
            'Full name should not be numeric',
          ],
        });

      case phoneNumber === null || phoneNumber === undefined || phoneNumber === '':
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

      case !email || emailRegex.test(email) === false:
        return res.status(400).json({
          error: 'please enter a valid email address e.g martinez@yahoo.com',
        });

      case !password || pwdRegex.test(password) === false:
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
