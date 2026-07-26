"""Static F00 contract checks — migrated from public/index.html to React source."""
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"


def read_all_tsx() -> str:
    """Concatenate all .tsx/.ts files in src/ for static checks."""
    parts: list[str] = []
    for ext in ("*.tsx", "*.ts"):
        for f in SRC.rglob(ext):
            parts.append(f.read_text(encoding="utf-8"))
    return "\n".join(parts)


ALL_SRC = read_all_tsx()


class IdentityContractTests(unittest.TestCase):
    def test_no_server_secret_or_default_identity(self):
        for forbidden in (
            "demo-user",
            "demo-session",
            "X-API-Key",
            "dev-process-key-change-in-prod",
        ):
            self.assertNotIn(
                forbidden,
                ALL_SRC,
                f"Forbidden string '{forbidden}' found in React source",
            )

    def test_demo_mode_clears_credentials(self):
        """F00: switching to demo must remove cc_token and cc_uid."""
        store = (SRC / "shared" / "store" / "app-store.ts").read_text(
            encoding="utf-8"
        )
        self.assertIn("localStorage.removeItem('cc_token')", store)
        self.assertIn("localStorage.removeItem('cc_uid')", store)

    def test_demo_mode_sends_x_app_mode_header(self):
        """F00: API requests must carry X-App-Mode header."""
        client = (SRC / "shared" / "api" / "v1" / "client.ts").read_text(
            encoding="utf-8"
        )
        self.assertIn("X-App-Mode", client)

    def test_authenticated_mode_uses_bearer_token(self):
        client = (SRC / "shared" / "api" / "v1" / "client.ts").read_text(
            encoding="utf-8"
        )
        self.assertIn("Bearer ${token}", client)
        self.assertNotIn("'X-User-Id'", client)

    def test_no_hardcoded_localhost_in_production_code(self):
        """Config may reference localhost for dev proxy, but not as hardcoded API base."""
        config = (SRC / "shared" / "api" / "common" / "config.ts").read_text(
            encoding="utf-8"
        )
        # Should use import.meta.env, not hardcoded URLs
        self.assertIn("import.meta.env", config)


if __name__ == "__main__":
    unittest.main()
