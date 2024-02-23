const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(cors());

const port = 8000;

app.use(bodyParser.json());

let users_db = [];
let stations_db = [];
let trains_db = [];
let user_credentials_db = [];

function saveUserCredentialsToDatabase(credentials) {
  user_credentials_db.push(credentials);
}

app.post('/api/credentials', async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password || !password_confirmation) {
      throw new Error('Incomplete credentials data');
    }

    if (password !== password_confirmation) {
      throw new Error('Password and password confirmation do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const credentials = {
      name,
      email,
      password: hashedPassword,
    };

    saveUserCredentialsToDatabase(credentials);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/login', (req, res) => {
  try {
    const { email, password } = req.query;

    if (!email || !password) {
      throw new Error('Incomplete login data');
    }

    // Find the user with the given email
    const user = user_credentials_db.find((user) => user.email === email);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    else
    {
      // Check if the provided password matches the hashed password
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        res.status(403).json({ message: 'Invalid password' });
      }
      else {// Login successful, you can perform redirection or send a success response
      res.status(200).json({ message: 'Login successful' });
      }
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/credentials', (req, res) => {
  try {
    const responseModel = { userCredentials: user_credentials_db };

    res.status(200).json(responseModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function saveUserToDatabase(user) {
  users_db.push(user);
}

app.post('/api/users', (req, res) => {
  try {
    const { user_id, user_name, balance } = req.body;

    if (user_id === undefined || user_name === undefined || balance === undefined) {
      throw new Error('Invalid request');
    }

    const user = {
      user_id,
      user_name,
      balance,
    };

    saveUserToDatabase(user);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function saveStationToDatabase(station) {
  stations_db.push(station);
}

app.post('/api/stations', (req, res) => {
  try {
    const { station_id, station_name, longitude, latitude } = req.body;

    if (station_id === undefined || station_name === undefined || longitude === undefined || latitude === undefined) {
      throw new Error('Invalid request');
    }

    const station = {
      station_id,
      station_name,
      longitude,
      latitude,
    };

    saveStationToDatabase(station);

    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function saveTrainToDatabase(train) {
  trains_db.push(train);
}

app.post('/api/trains', (req, res) => {
  try {
    const { train_id, train_name, capacity, stops } = req.body;

    if (train_id === undefined || train_name === undefined || capacity === undefined || stops === undefined) {
      throw new Error('Invalid request, missing required keys');
    }

    const serviceStart = stops.length > 0 ? stops[0].departure_time : null;
    const serviceEnds = stops.length > 0 ? stops[stops.length - 1].arrival_time : null;
    const numStations = stops.length;

    const train = {
      train_id,
      train_name,
      capacity,
      service_start: serviceStart,
      service_ends: serviceEnds,
      num_stations: numStations,
      stops: stops,
    };

    saveTrainToDatabase(train);

    const responseModel = {
      train_id: train.train_id,
      train_name: train.train_name,
      capacity: train.capacity,
      service_start: train.service_start,
      service_ends: train.service_ends,
      num_stations: train.num_stations,
    };

    res.status(201).json(responseModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stations', (req, res) => {
  try {
    const responseModel = { stations: stations_db };

    res.status(200).json(responseModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stations/:station_id/trains', (req, res) => {
  try {
    const stationId = parseInt(req.params.station_id);

    const station = stations_db.find(station => station.station_id === stationId);

    if (station) {
      const trainsAtStation = [];
      for (const train of trains_db) {
        for (const stop of train.stops) {
          if (stop.station_id === stationId) {
            const trainInfo = {
              train_id: train.train_id,
              train_name: train.train_name,
              arrival_time: stop.arrival_time,
              departure_time: stop.departure_time,
            };
            trainsAtStation.push(trainInfo);
          }
        }
      }

      trainsAtStation.sort((a, b) => {
        const aDeparture = a.departure_time ? a.departure_time : '';
        const bDeparture = b.departure_time ? b.departure_time : '';
        return aDeparture.localeCompare(bDeparture);
      });

      const responseModel = { station_id: stationId, trains: trainsAtStation };

      res.status(200).json(responseModel);
    } else {
      res.status(404).json({ message: `Station with id: ${stationId} was not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wallets/:wallet_id', (req, res) => {
  try {
    const walletId = parseInt(req.params.wallet_id);

    const walletUser = users_db.find(user => user.user_id === walletId);

    if (walletUser) {
      const responseModel = {
        wallet_id: walletId,
        balance: walletUser.balance,
        wallet_user: {
          user_id: walletUser.user_id,
          user_name: walletUser.user_name,
        },
      };

      res.status(200).json(responseModel);
    } else {
      res.status(404).json({ message: `Wallet with id: ${walletId} was not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function updateWalletBalance(walletId, rechargeAmount) {
  const user = users_db.find(user => user.user_id === walletId);

  if (user) {
    if (100 <= rechargeAmount && rechargeAmount <= 10000) {
      user.balance += rechargeAmount;
      return user;
    } else {
      return { error: 'invalid_amount' };
    }
  } else {
    return { error: 'not_found' };
  }
}

app.put('/api/wallets/:wallet_id', (req, res) => {
  try {
    const walletId = parseInt(req.params.wallet_id);
    const { recharge } = req.body;

    if (recharge === undefined) {
      res.status(400).json({ error: 'Invalid request, missing recharge amount' });
      return;
    }

    const updatedWallet = updateWalletBalance(walletId, recharge);

    if (!('error' in updatedWallet)) {
      const responseModel = {
        wallet_id: updatedWallet.user_id,
        balance: updatedWallet.balance,
        wallet_user: {
          user_id: updatedWallet.user_id,
          user_name: updatedWallet.user_name,
        },
      };

      res.status(200).json(responseModel);
    } else if (updatedWallet.error === 'not_found') {
      res.status(404).json({ message: `Wallet with id: ${walletId} was not found` });
    } else if (updatedWallet.error === 'invalid_amount') {
      res.status(400).json({ message: `Invalid amount: ${recharge}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function calculateTicketCost(route) {
  let totalCost = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const fromStation = route[i];
    const toStation = route[i + 1];

    let fromFare = 0;
    let toFare = 0;
    for (const train of trains_db) {
      for (const stop of train.stops) {
        if (stop.station_id === fromStation && stop.departure_time) {
          fromFare = stop.fare;
        }
        if (stop.station_id === toStation && stop.arrival_time) {
          toFare = stop.fare;
        }
      }
      totalCost += toFare - fromFare;
    }
  }
  return totalCost;
}

function findRoute(stationFrom, stationTo) {
  for (const train of trains_db) {
    const stops = train.stops;
    const stationIds = stops.map(stop => stop.station_id);

    if (stationIds.includes(stationFrom) && stationIds.includes(stationTo)) {
      const fromIndex = stationIds.indexOf(stationFrom);
      const toIndex = stationIds.indexOf(stationTo);

      if (fromIndex < toIndex) {
        return stationIds.slice(fromIndex, toIndex + 1);
      }
    }
  }

  return null;
}

function generateUniqueTicketId() {
  return random.int(1000, 9999);
}

function getTrainStopInfo(trainId, stationId) {
  for (const train of trains_db) {
    if (train.train_id === trainId) {
      for (const stop of train.stops) {
        if (stop.station_id === stationId) {
          return {
            train_id: trainId,
            arrival_time: stop.arrival_time,
            departure_time: stop.departure_time,
          };
        }
      }
      return {
        train_id: trainId,
        arrival_time: null,
        departure_time: null,
      };
    }
  }
  return null;
}

app.post('/api/tickets', (req, res) => {
  try {
    const { wallet_id, time_after, station_from, station_to } = req.body;

    if (wallet_id === undefined || time_after === undefined || station_from === undefined || station_to === undefined) {
      throw new Error('Invalid request');
    }

    const wallet = users_db.find(user => user.user_id === wallet_id);

    if (!wallet) {
      res.status(404).json({ message: `Wallet with id: ${wallet_id} was not found` });
      return;
    }

    const route = findRoute(station_from, station_to);

    if (!route) {
      res.status(403).json({ message: `No ticket available for station: ${station_from} to station: ${station_to}` });
      return;
    }

    const ticketCost = calculateTicketCost(route);

    if (wallet.balance < ticketCost) {
      const shortageAmount = ticketCost - wallet.balance;
      res.status(402).json({ message: `Recharge amount: ${shortageAmount} to purchase the ticket` });
      return;
    }

    wallet.balance -= ticketCost;

    const ticketId = generateUniqueTicketId();

    const responseModel = {
      ticket_id: ticketId,
      balance: wallet.balance,
      wallet_id: wallet_id,
      stations: route.map(station => {
        return {
          station_id: station,
          ...getTrainStopInfo(1, station), // Assuming train_id = 1, modify accordingly
        };
      }),
    };

    res.status(201).json(responseModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function convertToDatetime(timeStr) {
  if (timeStr) {
    return new Date(`1970-01-01T${timeStr}:00.000Z`);
  }
  return null;
}

function findOptimalRoute(stationFrom, stationTo, optimize) {
  try {
    const allTrains = trains_db;
    const allStations = stations_db;

    if (
      !allStations.some(station => station.station_id === stationFrom) ||
      !allStations.some(station => station.station_id === stationTo)
    ) {
      throw new Error(`No routes available from station: ${stationFrom} to station: ${stationTo}`);
    }

    const route = findRoute(stationFrom, stationTo);

    if (!route) {
      throw new Error(`No routes available from station: ${stationFrom} to station: ${stationTo}`);
    }

    let totalCost = 0;
    let totalTime = 0;

    const stationsInfo = [];
    for (let i = 0; i < route.length - 1; i++) {
      const fromStation = route[i];
      const toStation = route[i + 1];

      for (const train of allTrains) {
        for (const stop of train.stops) {
          if (stop.station_id === fromStation && stop.departure_time) {
            const fromTime = convertToDatetime(stop.departure_time);
          }
          if (stop.station_id === toStation && stop.arrival_time) {
            const toTime = convertToDatetime(stop.arrival_time);
            const segmentTime = (toTime - fromTime) / (1000 * 60);
            totalTime += segmentTime;
            totalCost += stop.fare;
          }
        }

        const stationInfo = {
          station_id: toStation,
          train_id: train.train_id,
          arrival_time: toTime.toISOString().slice(11, 16),
          departure_time: null,
        };
        stationsInfo.push(stationInfo);
      }
    }

    return {
      total_cost: totalCost,
      total_time: totalTime,
      stations: stationsInfo,
    };
  } catch (error) {
    throw error;
  }
}

app.get('/api/routes', (req, res) => {
  try {
    const station_from = parseInt(req.query.from);
    const station_to = parseInt(req.query.to);
    const optimize = req.query.optimize;

    const result = findOptimalRoute(station_from, station_to, optimize);

    res.status(200).json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
