const path = require("path");
const dotenv = require("dotenv");
const Joi = require("joi");

dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().port().default(5000),
  DATABASE_URL: Joi.string().allow("").optional(),
  DB_HOST: Joi.string().default("localhost"),
  DB_PORT: Joi.number().port().default(5432),
  DB_NAME: Joi.string().default("wealthwise_db"),
  DB_USER: Joi.string().default("postgres"),
  DB_PASSWORD: Joi.string().allow("").default(""),
  DB_SSL: Joi.boolean().truthy("true").falsy("false").default(false),
  CORS_ORIGIN: Joi.string().default("*")
}).unknown(true);

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true
});

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

const env = {
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,
  DATABASE_URL: value.DATABASE_URL,
  DB_HOST: value.DB_HOST,
  DB_PORT: value.DB_PORT,
  DB_NAME: value.DB_NAME,
  DB_USER: value.DB_USER,
  DB_PASSWORD: value.DB_PASSWORD,
  DB_SSL: value.DB_SSL,
  CORS_ORIGIN: value.CORS_ORIGIN
};

module.exports = { env };
