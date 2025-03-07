export default () => ({
  contentful: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    contentType: process.env.CONTENTFUL_CONTENT_TYPE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/product-api',
  },
});
