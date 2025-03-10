const services = {};

const register = (name, version, ip, port) => {
    // Use localhost if the IP address is 0.0.0.1 or 1
    if (ip === '0.0.0.1' || ip === '::1' || ip === '1') {
        ip = 'localhost';
    }
    const key = `${name}-${version}-${ip}:${port}`;
    services[key] = { name, version, ip, port };
    console.log(`Service registered: ${key}`);
    return key;
};

const unregister = (name, version, ip, port) => {
    if (ip === '0.0.0.1' || ip === '::1' || ip === '1') {
        ip = 'localhost';
    }
    delete services[`${name}-${version}-${ip}:${port}`];
    console.log(`Service unregistered: ${name}-${version}-${ip}:${port}`);
};

const getAllServices = () => Object.values(services);

export default { register, unregister, getAllServices };