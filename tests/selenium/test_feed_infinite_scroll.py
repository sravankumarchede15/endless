import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_homepage_feed_loads_cards(driver, base_url):
    """Test that homepage loads and renders initial video items."""
    driver.get(base_url)

    # Verify hero banner title
    title_el = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "feed-title"))
    )
    assert "feed that feels infinite" in title_el.text.lower()

    # Verify video articles exist
    articles = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.TAG_NAME, "article"))
    )
    assert len(articles) >= 10, f"Expected at least 10 cards, found {len(articles)}"


def test_infinite_scrolling_appends_cards(driver, base_url):
    """Test that scrolling the page dynamically triggers cursor loading and appends cards."""
    driver.get(base_url)

    # Wait for initial cards
    articles = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.TAG_NAME, "article"))
    )
    initial_count = len(articles)

    # Scroll down multiple times
    for _ in range(3):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1.5)

    updated_articles = driver.find_elements(By.TAG_NAME, "article")
    assert len(updated_articles) > initial_count, (
        f"Expected card count to increase from {initial_count}, but got {len(updated_articles)}"
    )
