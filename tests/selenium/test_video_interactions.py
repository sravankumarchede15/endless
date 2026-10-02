from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_video_detail_and_related(driver, base_url):
    """Test navigating to video details page and checking related list."""
    driver.get(base_url)

    # Click first video card
    first_card = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'article a[href^="/watch/"]'))
    )
    first_card.click()

    # Verify watch URL
    WebDriverWait(driver, 10).until(EC.url_contains("/watch/"))

    # Verify video title heading
    title_el = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.TAG_NAME, "h1"))
    )
    assert len(title_el.text) > 0

    # Verify Up next section exists
    up_next = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(), 'Up next')]"))
    )
    assert up_next.is_displayed()
