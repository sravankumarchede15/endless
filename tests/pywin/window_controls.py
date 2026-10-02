"""
Windows UI Automation & PyWin32 Utility for Endless Desktop Automation
Provides low-level and high-level Windows OS window controls, key simulation, and window captures.
"""
import os
import sys
import time
import subprocess

try:
    import win32gui
    import win32con
    import win32process
    HAS_WIN32 = True
except ImportError:
    HAS_WIN32 = False

try:
    from pywinauto import Application, Desktop
    from pywinauto.keyboard import send_keys
    HAS_PYWINAUTO = True
except ImportError:
    HAS_PYWINAUTO = False


class WindowsBrowserController:
    """Manages browser window instances on Windows using PyWin32 and pywinauto."""

    def __init__(self, target_url="http://localhost:5173"):
        self.target_url = target_url
        self.process = None
        self.app = None

    def launch_browser(self, browser="msedge"):
        """Launches MS Edge or Chrome to the Endless URL."""
        cmd = [browser, self.target_url]
        self.process = subprocess.Popen(cmd)
        time.sleep(3)
        return self.process

    def find_window_by_title(self, title_substr="Endless"):
        """Locates the window handle with matching title substring."""
        if not HAS_WIN32:
            print("[Warning] win32gui not installed.")
            return None

        found_hwnd = []

        def enum_cb(hwnd, extra):
            if win32gui.IsWindowVisible(hwnd):
                title = win32gui.GetWindowText(hwnd)
                if title_substr.lower() in title.lower():
                    found_hwnd.append((hwnd, title))

        win32gui.EnumWindows(enum_cb, None)
        return found_hwnd[0] if found_hwnd else None

    def focus_window(self, hwnd):
        """Brings the specified HWND to the foreground."""
        if not HAS_WIN32 or not hwnd:
            return False
        try:
            win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            win32gui.SetForegroundWindow(hwnd)
            time.sleep(0.5)
            return True
        except Exception as e:
            print(f"[Focus Error] {e}")
            return False

    def send_scroll_keys(self, times=3, delay=1.0):
        """Sends PageDown / Down arrow keys using pywinauto."""
        if not HAS_PYWINAUTO:
            print("[Warning] pywinauto not installed.")
            return
        for _ in range(times):
            send_keys('{PGDN}')
            time.sleep(delay)

    def send_search_keys(self, query="Tech"):
        """Simulates focusing search and typing query."""
        if not HAS_PYWINAUTO:
            return
        # Type slash to focus search (if supported) or tab navigation
        send_keys('^l')  # focus address bar or search
        time.sleep(0.5)
        send_keys(query + '{ENTER}')

    def close(self):
        """Closes the launched process if any."""
        if self.process:
            self.process.terminate()
