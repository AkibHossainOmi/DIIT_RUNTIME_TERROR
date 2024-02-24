const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const app = express();
app.use(cors());

const port = 8000;

app.use(bodyParser.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_id INTEGER,
      station_name TEXT,
      longitude REAL,
      latitude REAL
    );

    CREATE TABLE IF NOT EXISTS trains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_id INTEGER,
      train_name TEXT,
      capacity INTEGER,
      service_start TEXT,
      service_ends TEXT,
      num_stations INTEGER
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      user_name TEXT,
      balance REAL
    );
  `);
})();

async function saveUserCredentialsToDatabase(credentials) {
  const { name, email, password } = credentials;

  await db.run(`
    INSERT INTO user_credentials (name, email, password)
    VALUES (?, ?, ?)
  `, [name, email, password]);
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

    await saveUserCredentialsToDatabase(credentials);

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/login', async (req, res) => {
  try {
    const { email, password } = req.query;

    if (!email || !password) {
      throw new Error('Incomplete login data');
    }

    // Find the user with the given email
    const user = await db.get('SELECT * FROM user_credentials WHERE email = ?', [email]);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      // Check if the provided password matches the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(403).json({ message: 'Invalid password' });
      } else {
        // Login successful, you can perform redirection or send a success response
        res.status(200).json({ message: 'Login successful' });
      }
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});


app.get('/api/credentials', async (req, res) => {
  try {
    const userCredentials = await db.all('SELECT id, name, email FROM user_credentials');

    const responseModel = { userCredentials };

    res.status(200).json(responseModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/users', async (req, res) => {
  try {
    const { email, user_name, balance } = req.body;

    if (email === undefined || user_name === undefined || balance === undefined) {
      throw new Error('Invalid request');
    }

    // Insert user data into the 'users' table
    await db.run(`
      INSERT INTO users (email, user_name, balance)
      VALUES (?, ?, ?)
    `, [email, user_name, balance]);

    const user = {
      email,
      user_name,
      balance,
    };

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) {
      res.status(400).json({ message: 'Email parameter is required' });
      return;
    }

    // Fetch user data from the 'users' table based on email
    const user = await db.get('SELECT * FROM users WHERE email = ?', [userEmail]);

    if (user) {
      const responseModel = {
        email: user.email,
        user_name: user.user_name,
        balance: user.balance,
      };

      res.status(200).json(responseModel);
    } else {
      res.status(404).json({ message: `User with email: ${userEmail} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stations', async (req, res) => {
  try {
    const { station_id, station_name, longitude, latitude } = req.body;

    if (station_id === undefined || station_name === undefined || longitude === undefined || latitude === undefined) {
      throw new Error('Invalid request');
    }

    // Insert station data into the 'stations' table
    await db.run(`
      INSERT INTO stations (station_id, station_name, longitude, latitude)
      VALUES (?, ?, ?, ?)
    `, [station_id, station_name, longitude, latitude]);

    const station = {
      station_id,
      station_name,
      longitude,
      latitude,
    };

    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trains', async (req, res) => {
  try {
    const { train_id, train_name, capacity, stops } = req.body;

    if (train_id === undefined || train_name === undefined || capacity === undefined || stops === undefined) {
      throw new Error('Invalid request, missing required keys');
    }

    // Insert train data into the 'trains' table
    await db.run(`
      INSERT INTO trains (train_id, train_name, capacity, service_start, service_ends, num_stations)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [train_id, train_name, capacity, stops.length > 0 ? stops[0].departure_time : null, stops.length > 0 ? stops[stops.length - 1].arrival_time : null, stops.length]);

    const train = {
      train_id,
      train_name,
      capacity,
      service_start: stops.length > 0 ? stops[0].departure_time : null,
      service_ends: stops.length > 0 ? stops[stops.length - 1].arrival_time : null,
      num_stations: stops.length,
      stops: stops,
    };

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

app.get('/api/stations', async (req, res) => {
  try {
    // Fetch all station data from the 'stations' table
    const stations = await db.all('SELECT * FROM stations');

    const responseModel = { stations };

    res.status(200).json(responseModel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stations/:station_id/trains', async (req, res) => {
  try {
    const stationId = parseInt(req.params.station_id);

    // Fetch the station data from the 'stations' table
    const station = await db.get('SELECT * FROM stations WHERE station_id = ?', [stationId]);

    if (station) {
      // Fetch trains data from the 'trains' table based on the stationId
      const trainsAtStation = await db.all(`
        SELECT t.train_id, t.train_name, s.arrival_time, s.departure_time
        FROM trains t
        JOIN stops s ON t.train_id = s.train_id
        WHERE s.station_id = ?
      `, [stationId]);

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


app.get('/api/wallets/:wallet_id', async (req, res) => {
  try {
    const walletId = parseInt(req.params.wallet_id);

    // Fetch wallet data from the 'users' table based on the email
    const walletUser = await db.get('SELECT * FROM users WHERE email = ?', [walletId]);

    if (walletUser) {
      const responseModel = {
        wallet_id: walletId,
        balance: walletUser.balance,
        wallet_user: {
          email: walletUser.email,
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


async function updateWalletBalance(walletId, rechargeAmount) {
  try {
    // Fetch user data from the 'users' table based on the email
    const user = await db.get('SELECT * FROM users WHERE email = ?', [walletId]);

    if (user) {
      if (100 <= rechargeAmount && rechargeAmount <= 10000) {
        // Update the balance in the database
        await db.run('UPDATE users SET balance = balance + ? WHERE email = ?', [rechargeAmount, walletId]);

        // Fetch the updated user data
        const updatedUser = await db.get('SELECT * FROM users WHERE email = ?', [walletId]);

        return updatedUser;
      } else {
        return { error: 'invalid_amount' };
      }
    } else {
      return { error: 'not_found' };
    }
  } catch (error) {
    throw error;
  }
}

app.put('/api/wallets/:wallet_id', async (req, res) => {
  try {
    const walletId = parseInt(req.params.wallet_id);
    const { recharge } = req.body;

    if (recharge === undefined) {
      res.status(400).json({ error: 'Invalid request, missing recharge amount' });
      return;
    }

    const updatedWallet = await updateWalletBalance(walletId, recharge);

    if (!('error' in updatedWallet)) {
      const responseModel = {
        wallet_id: updatedWallet.email,
        balance: updatedWallet.balance,
        wallet_user: {
          email: updatedWallet.email,
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

async function calculateTicketCost(route) {
  let totalCost = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const fromStation = route[i];
    const toStation = route[i + 1];

    let fromFare = 0;
    let toFare = 0;

    for (const train of trains_db) {
      for (const stop of train.stops) {
        if (stop.station_id === fromStation && stop.departure_time) {
          // Fetch the fare for the fromStation and departure time from the database
          const fromFareInfo = await db.get('SELECT fare FROM stops WHERE station_id = ? AND departure_time = ?', [fromStation, stop.departure_time]);
          fromFare = fromFareInfo ? fromFareInfo.fare : 0;
        }

        if (stop.station_id === toStation && stop.arrival_time) {
          // Fetch the fare for the toStation and arrival time from the database
          const toFareInfo = await db.get('SELECT fare FROM stops WHERE station_id = ? AND arrival_time = ?', [toStation, stop.arrival_time]);
          toFare = toFareInfo ? toFareInfo.fare : 0;
        }
      }

      totalCost += toFare - fromFare;
    }
  }

  return totalCost;
}

async function findRoute(stationFrom, stationTo) {
  try {
    for (const train of trains_db) {
      const stops = train.stops;
      const stationIds = stops.map(stop => stop.station_id);

      if (stationIds.includes(stationFrom) && stationIds.includes(stationTo)) {
        const fromIndex = stationIds.indexOf(stationFrom);
        const toIndex = stationIds.indexOf(stationTo);

        if (fromIndex < toIndex) {
          // Fetch station IDs for the route from the 'stops' table in the database
          const routeStationIds = await db.all('SELECT station_id FROM stops WHERE train_id = ? AND stop_order BETWEEN ? AND ? ORDER BY stop_order', [train.train_id, fromIndex + 1, toIndex + 1]);

          return routeStationIds.map(row => row.station_id);
        }
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
}

function generateUniqueTicketId() {
  return random.int(1000, 9999);
}

async function getTrainStopInfo(trainId, stationId) {
  try {
    const train = trains_db.find(train => train.train_id === trainId);

    if (train) {
      // Fetch stop information from the 'stops' table in the database
      const stopInfo = await db.get('SELECT arrival_time, departure_time FROM stops WHERE train_id = ? AND station_id = ?', [trainId, stationId]);

      if (stopInfo) {
        return {
          train_id: trainId,
          arrival_time: stopInfo.arrival_time,
          departure_time: stopInfo.departure_time,
        };
      } else {
        return {
          train_id: trainId,
          arrival_time: null,
          departure_time: null,
        };
      }
    }

    return null;
  } catch (error) {
    throw error;
  }
}

app.post('/api/tickets', async (req, res) => {
  try {
    const { wallet_id, time_after, station_from, station_to } = req.body;

    if (wallet_id === undefined || time_after === undefined || station_from === undefined || station_to === undefined) {
      throw new Error('Invalid request');
    }

    // Fetch wallet information from the 'users' table in the database
    const wallet = await db.get('SELECT * FROM users WHERE email = ?', [wallet_id]);

    if (!wallet) {
      res.status(404).json({ message: `Wallet with id: ${wallet_id} was not found` });
      return;
    }

    // Fetch route information from the 'stops' table in the database
    const routeStationIds = await findRoute(station_from, station_to);

    if (!routeStationIds) {
      res.status(403).json({ message: `No ticket available for station: ${station_from} to station: ${station_to}` });
      return;
    }

    // Fetch ticket cost from the 'stops' table in the database
    const ticketCost = await calculateTicketCost(routeStationIds);

    if (wallet.balance < ticketCost) {
      const shortageAmount = ticketCost - wallet.balance;
      res.status(402).json({ message: `Recharge amount: ${shortageAmount} to purchase the ticket` });
      return;
    }

    wallet.balance -= ticketCost;

    // Generate a unique ticket ID
    const ticketId = generateUniqueTicketId();

    const stationsInfo = [];

    // Fetch stop information from the 'stops' table in the database
    for (const stationId of routeStationIds) {
      const stopInfo = await getTrainStopInfo(1, stationId); // Assuming train_id = 1, modify accordingly

      const stationInfo = {
        station_id: stationId,
        ...stopInfo,
      };

      stationsInfo.push(stationInfo);
    }

    const responseModel = {
      ticket_id: ticketId,
      balance: wallet.balance,
      wallet_id: wallet_id,
      stations: stationsInfo,
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

async function findOptimalRoute(stationFrom, stationTo, optimize) {
  try {
    const allTrains = await db.all('SELECT * FROM trains');
    const allStations = await db.all('SELECT * FROM stations');

    if (
      !allStations.some(station => station.station_id === stationFrom) ||
      !allStations.some(station => station.station_id === stationTo)
    ) {
      throw new Error(`No routes available from station: ${stationFrom} to station: ${stationTo}`);
    }

    const route = await findRoute(stationFrom, stationTo);

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

            for (const toStop of train.stops) {
              if (toStop.station_id === toStation && toStop.arrival_time) {
                const toTime = convertToDatetime(toStop.arrival_time);
                const segmentTime = (toTime - fromTime) / (1000 * 60);
                totalTime += segmentTime;
                totalCost += toStop.fare;

                const stationInfo = {
                  station_id: toStation,
                  train_id: train.train_id,
                  arrival_time: toTime.toISOString().slice(11, 16),
                  departure_time: null,
                };
                stationsInfo.push(stationInfo);
              }
            }
          }
        }
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

app.get('/api/routes', async (req, res) => {
  try {
    const station_from = parseInt(req.query.from);
    const station_to = parseInt(req.query.to);
    const optimize = req.query.optimize;

    const result = await findOptimalRoute(station_from, station_to, optimize);

    res.status(200).json(result);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
