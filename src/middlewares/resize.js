const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const catchAsync = require("express-async-handler");

exports.resizeAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  let filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/avatars/${filename}`);
  req.body.avatar = filename;
  next();
});
