import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

export const StationList = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/stations");
        if (response.ok) {
          const result = await response.json();
          const stationsData = result.stations || []; 
          setStations(stationsData);
        } else {
          console.error("Failed to fetch stations");
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []); 

  return (
    <>
    <Navbar/>
    <div className="max-w-screen-xl mx-auto ml-12">
      <h1 className="mt-20 text-3xl font-semibold text-left pl-4 text-purple-700 underline">
        Station List
      </h1>
      {stations.length > 0 ? (
        <div className="max-h-96 overflow-auto mt-5">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-200 py-2 px-4">Station Name</th>
                <th className="border border-gray-300 bg-gray-200 py-2 px-4">Latitude</th>
                <th className="border border-gray-300 bg-gray-200 py-2 px-4">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.station_id}>
                  <td className="border border-gray-300 py-2 px-4">{station.station_name}</td>
                  <td className="border border-gray-300 py-2 px-4">{station.latitude}</td>
                  <td className="border border-gray-300 py-2 px-4">{station.longitude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-5 ml-5">
          No stations available.
        </p>
      )}
    </div>
    </>
  );
};

export default StationList;