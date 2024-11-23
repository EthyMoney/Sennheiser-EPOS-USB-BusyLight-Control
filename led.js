const HID = require('node-hid');

// Your device IDs
const vendorId = 5013; // Sennheiser's vendorId
const productId = 116; // Sennheiser UI 20 BL productId

try {
  const device = new HID.HID(vendorId, productId);
  console.log("Connected to Sennheiser UI 20 BL");

  // Function to send raw data to the device
  function sendPacket(data) {
    console.log("Sending packet:", Buffer.from(data).toString('hex'));
    device.write(data);
  }

  // Function to create a packet for RGB colors
  function createColorPacket(red, green, blue, lightOn = true) {
    const packet = [
      0x01, 0x12, 0x02,     // Header
      red, green, blue,     // RGB bytes
      red, green, blue,     // Repeat (mirror RGB values)
      lightOn ? 0x01 : 0x00, // Light on/off flag
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ];
    return packet;
  }

  // Example color packets
  const redPacket = createColorPacket(0xc0, 0x00, 0x00); // Red
  const greenPacket = createColorPacket(0x00, 0xc0, 0x00); // Green
  const bluePacket = createColorPacket(0x00, 0x00, 0xc0); // Blue
  const offPacket = createColorPacket(0x00, 0x00, 0x00, false); // Off

  // Schedule color changes
  setTimeout(() => sendPacket(redPacket), 1000); // Red after 1 second
  setTimeout(() => sendPacket(greenPacket), 2000); // Green after 2 seconds
  setTimeout(() => sendPacket(bluePacket), 3000); // Blue after 3 seconds
  setTimeout(() => sendPacket(offPacket), 4000); // Off after 4 seconds

  // Clean up
  process.on('exit', () => {
    device.close();
    console.log("Disconnected from device");
  });
} catch (err) {
  console.error("Failed to connect to device:", err.message);
}
