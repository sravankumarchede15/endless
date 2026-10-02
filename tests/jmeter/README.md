# Apache JMeter Performance & Load Testing for Endless

This directory contains the Apache JMeter load testing test plan, parameterized dataset, and automated execution scripts for testing the Endless infinite feed recommendation engine and API endpoints.

## Test Plan Architecture (`endless_load_test.jmx`)

The test plan evaluates the system under concurrent load with the following features:
- **Thread Group**: Configurable simulated virtual users with ramp-up time and test duration.
- **CSV Data Set Config**: Reads `user_parameters.csv` for realistic randomized sessions, search terms, and category targets.
- **Dynamic Cursor Pagination**: Uses a JSON PostProcessor (`$.nextCursor`) to simulate realistic user feed consumption across consecutive slices.
- **Assertions**:
  - Response Code `200 OK`
  - Latency SLA `< 800ms` duration assertions
- **Endpoints Tested**:
  1. `GET /api/feed?session=${sessionId}&cache=on&limit=20`
  2. `GET /api/feed?session=${sessionId}&cursor=${nextCursor}&cache=on&limit=20`
  3. `GET /api/browse?kind=category&value=${category}&limit=20`
  4. `GET /api/search?q=${searchTerm}`
  5. `GET /api/metrics`

---

## Running with Apache JMeter GUI

1. Launch JMeter:
   ```bash
   jmeter
   ```
2. Open `tests/jmeter/endless_load_test.jmx`.
3. Click the green **Start** button (or `Ctrl + R`) to execute the plan and view real-time results in **Summary Report** and **View Results Tree**.

---

## Running via CLI Runner

Run the included automated runner:

```bash
# Default (30 threads, 20s duration against http://localhost:4000)
python jmeter_runner.py

# Custom target and concurrency
python jmeter_runner.py --host localhost --port 4000 --threads 50 --duration 60 --rampup 10
```

### Direct JMeter Non-GUI Command

```bash
jmeter -n -t endless_load_test.jmx -l results/results.jtl -e -o results/html_report -Jhost=localhost -Jport=4000 -Jthreads=50 -Jduration=60
```
