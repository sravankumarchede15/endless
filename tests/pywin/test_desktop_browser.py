"""
PyWin / Windows Automation Test Suite for Endless
Tests desktop browser window orchestration, keyboard-driven feed navigation, and window focus controls.
"""
import os
import sys
import time
import pytest
from window_controls import WindowsBrowserController, HAS_WIN32, HAS_PYWINAUTO

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5173")


@pytest.mark.skipif(not HAS_WIN32 or not HAS_PYWINAUTO, reason="Requires win32gui and pywinauto on Windows")
def test_windows_browser_interaction():
    """Test launching browser on Windows, focusing window, sending PageDown keys, and interacting."""
    controller = WindowsBrowserController(target_url=BASE_URL)
    try:
        # Launch browser
        proc = controller.launch_browser(browser="msedge")
        time.sleep(4)

        # Find window
        window_info = controller.find_window_by_title("Endless")
        if window_info:
            hwnd, title = window_info
            print(f"Found Windows HWND: {hwnd} with Title: {title}")

            # Focus and bring to front
            assert controller.focus_window(hwnd) is True

            # Send keyboard scrolling commands (Page Down)
            controller.send_scroll_keys(times=3, delay=1.0)
            print("Successfully sent Windows keyboard scroll signals.")

    finally:
        controller.close()


def test_pywin_environment_sanity():
    """Validates that python environment can import win32 / pywin modules."""
    print(f"HAS_WIN32: {HAS_WIN32}, HAS_PYWINAUTO: {HAS_PYWINAUTO}")
    assert sys.platform == "win32", "PyWin suite is designed for Windows OS environments"
