import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_search_functionality(driver, base_url):
    """Test searching for videos via topbar input."""
    driver.get(base_url)

    search_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[aria-label="Search videos"]'))
    )
    search_input.clear()
    search_input.send_keys("Tech" + Keys.RETURN)

    # Wait for search results page
    WebDriverWait(driver, 10).until(EC.url_contains("/search?q=Tech"))

    # Verify results heading or content cards
    heading = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "h1, h2"))
    )
    assert "Tech" in heading.text or "results" in heading.text.lower()


def test_category_navigation(driver, base_url):
    """Test clicking a category pill filters content."""
    driver.get(base_url)

    # Click a category link (e.g. Gaming)
    category_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[href*="/category/"]'))
    )
    category_name = category_link.text.strip()
    category_link.click()

    WebDriverWait(driver, 10).until(EC.url_contains("/category/"))
    h1_el = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.TAG_NAME, "h1"))
    )
    assert len(h1_el.text) > 0
