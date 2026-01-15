const QRCode = require("qrcode");
const cloudinary = require("../config/cloudinary");

exports.makeQrAndUpload = async ({ qrText, publicId }) => {
  const dataUrl = await QRCode.toDataURL(qrText, { errorCorrectionLevel: "M", margin: 2, scale: 8 });

  const folder = process.env.CLOUDINARY_FOLDER || "pawtal/qr";
  const upload = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return upload.secure_url;
};
