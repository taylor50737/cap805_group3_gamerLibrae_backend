const cloudinary = require('cloudinary').v2;

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getSignature = (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: req.query.folder,
    },
    cloudinaryConfig.api_secret,
  );
  res.json({ timestamp, signature });
};

exports.getSignature = getSignature;
