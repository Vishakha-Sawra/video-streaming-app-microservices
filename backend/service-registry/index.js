import express from "express";
import cors from "cors"; // Import the cors middleware
import serviceRegistry from "./serviceRegistry.js";

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

app.get("/", (_, res) => res.send("Service Registry Running"));

// Register a new service
app.put("/register/:serviceName/:serviceVersion/:servicePort", (req, res) => {
  const { serviceName, serviceVersion, servicePort } = req.params;
  let serviceIp = req.socket.remoteAddress;

  // Handle IPv6 addresses and remove any additional information
  if (serviceIp.includes("::ffff:")) {
    serviceIp = serviceIp.split("::ffff:")[1];
  } else if (serviceIp.includes(":")) {
    serviceIp = serviceIp.split(":").pop();
  }

  const serviceKey = serviceRegistry.register(serviceName, serviceVersion, serviceIp, servicePort);
  res.json({ serviceKey });
});

// Unregister a service
app.delete("/register/:serviceName/:serviceVersion/:servicePort", (req, res) => {
  const { serviceName, serviceVersion, servicePort } = req.params;
  let serviceIp = req.socket.remoteAddress;

  // Handle IPv6 addresses and remove any additional information
  if (serviceIp.includes("::ffff:")) {
    serviceIp = serviceIp.split("::ffff:")[1];
  } else if (serviceIp.includes(":")) {
    serviceIp = serviceIp.split(":").pop();
  }

  serviceRegistry.unregister(serviceName, serviceVersion, serviceIp, servicePort);
  res.status(200).send("Service unregistered");
});

// Get all services
app.get("/services", (_, res) => {
  res.json(serviceRegistry.getAllServices());
});

app.listen(port, () => console.log(`Service Registry running on http://localhost:${port}`));