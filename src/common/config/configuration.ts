export default () => ({
  app: {
    port: process.env.PORT || '3333',
    server_url: process.env.SERVER_URL || '',
    client_url: process.env.CLIENT_URL || '',
    salt_round: process.env.SALT_ROUND || '',
  },
  email: {
    server: process.env.MAIL_SERVER || '',
    password: process.env.MAIL_PASSWORD || '',
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    sender: process.env.MAIL_SENDER || '',
  },
  cloud:{
    cloud_name : process.env.CLOUD_NAME || '',
    api_key : process.env.CLOUD_API_KEY || '',
    api_secret : process.env.CLOUD_API_SECRET || '',
  }
});
