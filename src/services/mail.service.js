const transporter = require("../config/mailer");
const Notification = require("../models/Notification");

exports.sendPetScannedEmail = async ({ to, ownerName, petName, petCode, scan, publicLink, userId }) => {
  const title = `Pawtal: Có người vừa quét QR của ${petName}`;
  const time = new Date(scan.scannedAt).toLocaleString("vi-VN");

  const html = `
    <div style="font-family:Arial;line-height:1.6">
      <h2>Pawtal thông báo</h2>
      <p>Xin chào <b>${ownerName || "bạn"}</b>,</p>
      <p>Có người vừa quét tag của <b>${petName}</b> (Mã: <b>${petCode}</b>).</p>
      <ul>
        <li><b>Thời gian:</b> ${time}</li>
        <li><b>Liên hệ:</b> ${scan.contact || "Không có"}</li>
        <li><b>Lời nhắn:</b> ${scan.message || "Không có"}</li>
      </ul>
      <p>Mở trang công khai:</p>
      <p><a href="${publicLink}">${publicLink}</a></p>
    </div>
  `;

  const notif = await Notification.create({
    userId,
    type: "PET_SCANNED",
    title,
    body: `Liên hệ: ${scan.contact || "N/A"} | Lời nhắn: ${scan.message || "N/A"}`,
    data: { petCode, scanId: scan._id },
    status: "queued",
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: title,
      html,
    });

    notif.status = "sent";
    notif.sentAt = new Date();
    await notif.save();
  } catch (e) {
    notif.status = "failed";
    notif.error = e?.message || "send failed";
    await notif.save();
  }
};
