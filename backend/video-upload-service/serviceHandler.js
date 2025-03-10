import fetch from "node-fetch";

export const registerService = (port, config) => {
  const url = `http://localhost:3000/register/${config.name}/${config.version}/${port}`;
  fetch(url, { method: "PUT" })
    .then((res) => res.json())
    .then((data) => console.log(`Service registered: ${data.serviceKey}`))
    .catch(console.error);
};

export const unregisterService = (port, config) => {
  const url = `http://localhost:3000/register/${config.name}/${config.version}/${port}`;
  fetch(url, { method: "DELETE" })
    .then(() => console.log(`Service unregistered from port ${port}`))
    .catch(console.error);
};