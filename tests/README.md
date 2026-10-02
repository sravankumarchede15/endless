# Endless - Automated Testing & Performance Testing Suite

This repository includes a multi-tier automation testing architecture covering **Playwright (E2E Web)**, **Selenium WebDriver (Cross-Browser)**, **PyWin / pywinauto (Windows Desktop & OS Automation)**, and **Apache JMeter (Load & Stress Testing)**.

---

## 📁 Test Suite Architecture

```text
tests/
├── playwright/                   # Modern End-to-End browser UI automation
│   ├── package.json              # Playwright dependencies & scripts
│   ├── playwright.config.js      # Multi-browser & webServer config
│   ├── fixtures/
│   │   └── helpers.js            # Page Object Model & helpers
│   └── e2e/
│       ├── feed.spec.js          # Infinite scrolling & cursor pagination tests
│       ├── watch.spec.js         # Video player, reactions, related items
│       ├── navigation.spec.js    # Trending, categories, search queries
│       ├── auth.spec.js          # Sign-in modal, registration, profile flow
│       └── lab.spec.js           # Observability lab & metrics race tests
│
├── selenium/                     # Cross-browser WebDriver tests
│   ├── requirements.txt          # pytest, selenium, webdriver-manager
│   ├── conftest.py               # Chrome / Firefox / Edge / Headless fixtures
│   ├── test_feed_infinite_scroll.py # Infinite feed card DOM verification
│   ├── test_search_and_filter.py # Search queries & category navigation
│   ├── test_video_interactions.py# Watch page navigation & reactions
│   └── test_lab_metrics.py       # Metrics cards & controls verification
│
├── pywin/                        # Windows UI Automation & PyWin32
│   ├── requirements.txt          # pywinauto, pywin32, pillow, pytest
│   ├── window_controls.py        # Win32 window focus & key sender utility
│   └── test_desktop_browser.py   # Windows desktop app automation & keys
│
└── jmeter/                       # Apache JMeter Performance & Load Tests
    ├── endless_load_test.jmx     # Full JMeter 5.x Test Plan XML
    ├── user_parameters.csv       # Parameterized session & query dataset
    ├── jmeter_runner.py          # Automated CLI runner & HTML reporter
    └── README.md                 # JMeter GUI & CLI execution guide
```

---

## 🚀 Quick Execution Guide

### 1. Playwright (End-to-End Browser Testing)

```bash
# Install Playwright dependencies
cd tests/playwright
npm install
npx playwright install

# Run all tests in headless mode
npm test

# Run with interactive UI mode
npm run test:ui

# Run against specific URL
BASE_URL=http://localhost:5173 npm test
```

### 2. Selenium WebDriver (Python + pytest)

```bash
# Install Python dependencies
pip install -r tests/selenium/requirements.txt

# Run all Selenium tests
pytest tests/selenium -v

# Run with specific browser (chrome, edge, firefox)
SELENIUM_BROWSER=edge HEADLESS=true pytest tests/selenium
```

### 3. PyWin / pywinauto (Windows Desktop Automation)

```bash
# Install PyWin dependencies
pip install -r tests/pywin/requirements.txt

# Run Windows automation tests
pytest tests/pywin -v -s
```

### 4. Apache JMeter (Load & Performance Testing)

```bash
# Run with automated Python runner (supports both native JMeter and built-in load engine)
python tests/jmeter/jmeter_runner.py --threads 50 --duration 30

# Or open in JMeter GUI
jmeter -t tests/jmeter/endless_load_test.jmx
```
