import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const TrainList = () => {
  const [stations, setStations] = useState([]);
  const [dataForAllStations, setDataForAllStations] = useState([]);

  const fetchTrainsForStation = async (stationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/stations/${stationId}/trains`);
      if (response.ok) {
        const result = await response.json();
        return result.trains || [];
      } else {
        console.error(`Failed to fetch trains for station ${stationId}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching trains for station ${stationId}:`, error);
      return [];
    }
  };

  const fetchDataForAllStations = async () => {
    const promises = stations.map(async (station) => {
      const { station_id, station_name } = station;
      const trains = await fetchTrainsForStation(station_id);
      return { station_name, trains };
    });

    return await Promise.all(promises);
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stations`);
        if (response.ok) {
          const result = await response.json();
          setStations(result.stations || []);
        } else {
          console.error("Failed to fetch stations and trains");
        }
      } catch (error) {
        console.error("Error fetching stations and trains:", error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataForAllStations();
      setDataForAllStations(data);
    };

    fetchData();
  }, [stations]);

  return (
    <div>
      <Navbar/>
      <div className="mt-20 ml-12">
        <h2>Trains at All Stations</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-200 py-2 px-4">Station Name</th>
              <th className="border border-gray-300 bg-gray-200 py-2 px-4">Train NAME</th>
              <th className="border border-gray-300 bg-gray-200 py-2 px-4">Arrival Time</th>
              <th className="border border-gray-300 bg-gray-200 py-2 px-4">Departure Time</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataForAllStations) &&
              dataForAllStations.map(({ station_name, trains }) => (
                <React.Fragment key={station_name}>
                  <tr>
                    <td className="border border-gray-300 py-2 px-4 text-center" rowSpan={trains.length + 1}>
                      {station_name}
                    </td>
                  </tr>
                  {trains.map((train) => (
                    <tr key={train.train_name}>
                      <td className="border border-gray-300 py-2 px-4 text-center">{train.train_name}</td>
                      <td className="border border-gray-300 py-2 px-4 text-center">{train.arrival_time}</td>
                      <td className="border border-gray-300 py-2 px-4 text-center">{train.departure_time}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainList;
