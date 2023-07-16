const cloudinary = require('cloudinary').v2;

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getExpectedSignature = (public_id, version) => {
  const expectedSignature = cloudinary.utils.api_sign_request(
    {
      public_id: public_id,
      version: version,
    },
    cloudinaryConfig.api_secret,
  );
  return expectedSignature;
};

exports.getExpectedSignature = getExpectedSignature;
