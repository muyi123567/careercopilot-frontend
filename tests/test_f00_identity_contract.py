"""Static F00 contract checks for the Vite/React frontend."""
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
CLIENT = (ROOT / "src" / "shared" / "api" / "client.ts").read_text(encoding="utf-8")
SESSION = (ROOT / "src" / "shared" / "auth" / "session.tsx").read_text(encoding="utf-8")
FETCH = (ROOT / "src" / "shared" / "api" / "fetch.ts").read_text(encoding="utf-8")
CSRF = (ROOT / "src" / "shared" / "api" / "csrf.ts").read_text(encoding="utf-8")


class IdentityContractTests(unittest.TestCase):
    def test_browser_bundle_contains_no_server_secret_or_default_identity(self):
        for forbidden in (
            "demo-user",
            "demo-session",
            "X-API-Key",
            "dev-process-key-change-in-prod",
            "http://localhost:8000",
        ):
            self.assertNotIn(forbidden, CLIENT + SESSION)

    def test_production_navigation_has_no_mock_scenario_or_synthetic_success_path(self):
        self.assertNotIn("MockScenario", CLIENT + SESSION)
        self.assertNotIn("mockScenario", CLIENT + SESSION)
        self.assertNotIn("buildDataInsufficientResponse", CLIENT)
        self.assertNotIn("buildOkResponse", CLIENT)

    def test_authenticated_mode_uses_cookie_session(self):
        self.assertNotIn("Authorization = `Bearer", CLIENT)
        self.assertNotIn("'X-User-Id'", CLIENT)
        self.assertIn("credentials: 'include'", FETCH)
        self.assertIn("X-CSRF-Token", FETCH)
        self.assertNotIn("localStorage.setItem", CLIENT + SESSION + CSRF)
        self.assertNotIn("localStorage.getItem", CLIENT + SESSION + CSRF)
        self.assertNotIn("cc_token", CLIENT + SESSION)
        self.assertNotIn("cc_uid", CLIENT + SESSION)

    def test_browser_bundle_uses_no_fixed_client_session_identity(self):
        self.assertNotIn("createClientSessionId", CLIENT + SESSION)
        self.assertNotIn("web-session", CLIENT + SESSION)

    def test_api_base_is_runtime_configured(self):
        self.assertIn("window.EVIDWAY_CONFIG", CLIENT)
        self.assertIn("cfg.apiBase", CLIENT)


if __name__ == "__main__":
    unittest.main()
