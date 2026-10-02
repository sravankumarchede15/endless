from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_lab_page_loads_and_displays_stats(driver, base_url):
    """Test the lab dashboard metrics view."""
    driver.get(f"{base_url}/lab")

    # Verify lab heading
    h1_el = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.TAG_NAME, "h1"))
    )
    assert "Live Lab" in h1_el.text

    # Verify Controls panel
    controls_el = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Controls')]"))
    )
    assert controls_el.is_displayed()
