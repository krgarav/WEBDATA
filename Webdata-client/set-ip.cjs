const fs = require("fs");
const os = require("os");

// Function to get local IP address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (!iface.internal && iface.family === "IPv4") {
        return iface.address; // Return the first found IPv4 address
      }
    }
  }
  return "127.0.0.1"; // Fallback if no external IP is found
};

const localIP = getLocalIp();
const envFilePath = "./.env";

// Update the .env file
const envData = `VITE_API_URL=http://${localIP}:4000\n`;

fs.writeFile(envFilePath, envData, "utf8", (err) => {
  if (err) {
    console.error("Error updating .env file:", err);
    process.exit(1);
  }
  console.log(`Updated VITE_API_URL to ${localIP}:4000`);
});
