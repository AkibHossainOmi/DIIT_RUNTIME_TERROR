import React, { useState, useEffect } from "react";

export const StationList = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/stations");
        if (response.ok) {
          const result = await response.json();
          const stationsData = result.stations || []; // Extract stations array or use an empty array
          setStations(stationsData);
        } else {
          console.error("Failed to fetch stations");
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []); // empty dependency array means this effect runs once after the initial render

  return (
    <div>
        <h1 className="text-3xl font-semibold text-left pl-4 text-purple-700 underline">
                   Station List
                </h1>
      {/* <h2>Station List</h2> */}
      <ul>
        {Array.isArray(stations) &&
          stations.map((station) => (
            <li key={station.station_id}>
              {`Station Name: ${station.station_name}, Latitude: ${station.latitude}, Longitude: ${station.longitude}`}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StationList;
