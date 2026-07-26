"""Static F00 contract checks for the Vite/React frontend."""
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
CLIENT = (ROOT / "src" / "shared" / "api" / "client.ts").read_text(encoding="utf-8")
SESSION = (ROOT / "src" / "shared" / "auth" / "session.tsx").read_text(encoding="utf-8")


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

    def test_demo_mode_is_explicit_and_read_only(self):
        self.assertIn("type AccessMode = 'demo' | 'authenticated'", CLIENT)
        self.assertIn("if (opts.mode === 'demo' || forceMock)", CLIENT)
        self.assertIn("const [mode, setMode] = useState<AccessMode>('demo')", SESSION)

    def test_authenticated_mode_uses_bearer_token(self):
        self.assertIn("headers.Authorization = `Bearer ${opts.token}`", CLIENT)
        self.assertNotIn("'X-User-Id'", CLIENT)

    def test_backend_scoped_session_replaces_client_session(self):
        self.assertIn("createClientSessionId", CLIENT)
        self.assertIn("useMemo(() => createClientSessionId(), [])", SESSION)
        self.assertNotIn("demo-session", SESSION)

    def test_api_base_is_runtime_configured(self):
        self.assertIn("window.CAREERCOPILOT_CONFIG", CLIENT)
        self.assertIn("cfg.apiBase", CLIENT)


if __name__ == "__main__":
    unittest.main()
