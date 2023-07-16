const { getExpectedSignature } = require('../utils/cloudinaryUtils');

const validateImageSignature = (req, res, next) => {
  // Get expected signature by combining public_id, version and our api_secret
  const expectedBannerSignature = getExpectedSignature(
    req.body.bannerResBody.public_id,
    req.body.bannerResBody.version,
  );
  const expectedPortraitSignature = getExpectedSignature(
    req.body.portraitResBody.public_id,
    req.body.portraitResBody.version,
  );

  // If the signature received is the same as the one we generated, we can confirm the uploaded image is the same and not modified
  if (
    expectedBannerSignature !== req.body.bannerResBody.signature ||
    expectedPortraitSignature !== req.body.portraitResBody.signature
  ) {
    res
      .status(400)
      .json({ error: 'Signature error, received signature does not match expected signature' });
    return;
  }
  next();
};

exports.validateImageSignature = validateImageSignature;
