import QRCode from "qrcode"

// Generate QR code as data URL
export const generateQRCode = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 1,
      scale: 8,
    })

    return qrCodeDataURL
  } catch (error) {
    console.error("QR Code generation error:", error)
    throw new Error("Failed to generate QR code")
  }
}

// Generate QR code as buffer
export const generateQRCodeBuffer = async (data) => {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: "H",
      type: "png",
      margin: 1,
      scale: 8,
    })

    return qrCodeBuffer
  } catch (error) {
    console.error("QR Code generation error:", error)
    throw new Error("Failed to generate QR code")
  }
}

