import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

@pytest.fixture(scope="session")
def base_url():
    """Returns the base target URL for testing."""
    return os.environ.get("BASE_URL", "http://localhost:5173")

@pytest.fixture(scope="function")
def driver():
    """Initializes and provides a clean Selenium WebDriver instance."""
    browser_name = os.environ.get("SELENIUM_BROWSER", "chrome").lower()
    headless = os.environ.get("HEADLESS", "true").lower() in ("true", "1", "yes")

    if browser_name == "firefox":
        options = FirefoxOptions()
        if headless:
            options.add_argument("-headless")
        driver = webdriver.Firefox(options=options)
    elif browser_name == "edge":
        options = EdgeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Edge(options=options)
    else:  # default to Chrome
        options = ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        driver = webdriver.Chrome(options=options)

    driver.implicitly_wait(10)
    driver.set_page_load_timeout(30)

    yield driver

    driver.quit()
