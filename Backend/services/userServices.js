/* eslint-disable class-methods-use-this */
import models from '../models';

const {
  users, clients
} = models;
/**
 * item service
 */
class userService {
  /**
	 *
	 * @param {email} logged email of the user
	 * @param {userType} type of the user client or supplier
	 * @returns {Object} user
	 */
  // checking user
  async checkingUser(email, userType) {
    const findUser = await users.findOne({
      where: {
        email,
        userType,
      },
      returning: true,
      raw: true,
      nest: true,
    });
    return findUser;
  }

  /**
	 *
	 * @param {email} logged email of the user
	 * @param {userType} type of the user client or supplier
	 * @returns {Object} user
	 */
  // checking user
  async createClient(names, email, phoneNumber, address, location) {
    const client = await clients.findOrCreate({
      where: {
        email,
      },
      defaults: {
        names,
        phoneNumber,
        address,
        location
      },
      returning: true,
      raw: true,
      nest: true,
    });
    return client;
  }
}

export default new userService();
