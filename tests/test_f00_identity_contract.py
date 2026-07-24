"""Static F00 contract checks for the zero-build frontend."""
from pathlib import Path
import unittest


INDEX = (
    Path(__file__).resolve().parents[1] / "public" / "index.html"
).read_text(encoding="utf-8")


class IdentityContractTests(unittest.TestCase):
    def test_browser_bundle_contains_no_server_secret_or_default_identity(self):
        for forbidden in (
            "demo-user",
            "demo-session",
            "X-API-Key",
            "dev-process-key-change-in-prod",
            "http://localhost:8000",
        ):
            self.assertNotIn(forbidden, INDEX)

    def test_demo_mode_is_explicit_and_read_only(self):
        self.assertIn('id="access-mode"', INDEX)
        self.assertIn('value="demo">只读演示', INDEX)
        self.assertIn("payload.mode = 'demo'", INDEX)
        self.assertIn("data.mode !== 'demo'", INDEX)
        self.assertIn("不读取、不保存个人画像", INDEX)

    def test_authenticated_mode_uses_bearer_token(self):
        self.assertIn('value="authenticated"', INDEX)
        self.assertIn("headers.Authorization = `Bearer ${token}`", INDEX)
        self.assertNotIn("'X-User-Id'", INDEX)

    def test_backend_scoped_session_replaces_client_session(self):
        self.assertIn("session_id: sessionId", INDEX)
        self.assertIn("sessionId = data.session_id", INDEX)

    def test_api_base_is_runtime_configured(self):
        self.assertIn("window.CAREERCOPILOT_CONFIG", INDEX)
        self.assertIn("window.location.origin", INDEX)


if __name__ == "__main__":
    unittest.main()
