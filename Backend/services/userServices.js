/* eslint-disable class-methods-use-this */
import models from '../models';

const {
  users,
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
        userType
      },
      returning: true,
      raw: true,
      nest: true
    });
    return findUser;
  }
}

export default new userService();
