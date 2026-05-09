const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
  },
  test: {
    use_env_variable: 'DATABASE_TEST',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    dialectOptions: {
    },
  },
  secret_key_code: process.env.SECRET,
};

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  console.error('CRITICAL ERROR: DATABASE_URL is not set in environment variables.');
  process.exit(1);
}
