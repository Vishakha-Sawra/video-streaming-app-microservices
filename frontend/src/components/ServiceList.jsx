import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ServiceList = ({ onSelectService }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Available Streaming Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Link key={index} to="/videos">
            <button
              onClick={() => onSelectService(service)}
              className="bg-[#d95757] hover:bg-[#d96f57c9] text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              {service.name} ({service.ip}:{service.port})
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
