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
        return { stationId, trains: result.trains || [] };
      } else {
        console.error(`Failed to fetch trains for station ${stationId}`);
        return { stationId, trains: [] };
      }
    } catch (error) {
      console.error(`Error fetching trains for station ${stationId}:`, error);
      return { stationId, trains: [] };
    }
  };

  const fetchDataForAllStations = async () => {
    const promises = stations.map(async (station) => {
      const { station_id, station_name } = station;
      const trainsData = await fetchTrainsForStation(station_id);
      return { station_id, station_name, trains: trainsData.trains };
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
        {Array.isArray(dataForAllStations) &&
          dataForAllStations.map(({ station_id, station_name, trains }) => (
            <div key={station_id}>
              <h3>{`Station ${station_id} - ${station_name}`}</h3>
              <ul>
                {Array.isArray(trains) &&
                  trains.map((train) => (
                    <li key={train.train_id}>
                      {`Train ID: ${train.train_id}, Arrival Time: ${train.arrival_time}, Departure Time: ${train.departure_time}`}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrainList;
