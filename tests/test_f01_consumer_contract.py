from pathlib import Path
import hashlib
import unittest


ROOT = Path(__file__).resolve().parents[1]
CLIENT = (ROOT / "src" / "shared" / "api" / "client.ts").read_text(encoding="utf-8")
VALIDATOR = (ROOT / "src" / "shared" / "api" / "validate.ts").read_text(encoding="utf-8")
SCHEMA = (
    ROOT
    / "contracts"
    / "career-navigation"
    / "career-navigation-v2.0.0.schema.json"
)
CANONICAL_SHA256 = (
    "b2ec7fe7ae3933771464b7d81e1268c8b374ef17d52a7d3988197708371f9c93"
)


class StructuredConsumerTests(unittest.TestCase):
    def test_vendored_contract_matches_b_canonical_pin(self):
        canonical_bytes = SCHEMA.read_bytes().replace(b"\r\n", b"\n")
        self.assertEqual(
            hashlib.sha256(canonical_bytes).hexdigest(),
            CANONICAL_SHA256,
        )

    def test_authenticated_flow_uses_v2_endpoint(self):
        self.assertIn("apiFetch('/api/v2/navigation'", CLIENT)
        self.assertIn("validateNavigationResponse(json)", CLIENT)

    def test_frontend_does_not_parse_llm_text(self):
        for forbidden in (
            "parsePercent",
            "技能匹配度:",
            "市场需求度:",
            "综合评分:",
            "text.split",
        ):
            self.assertNotIn(forbidden, CLIENT + VALIDATOR)

    def test_api_data_is_not_inserted_with_inner_html(self):
        source = "\n".join(
            path.read_text(encoding="utf-8")
            for path in (ROOT / "src").rglob("*.tsx")
        )
        self.assertNotIn(".innerHTML", source)

    def test_iframe_sandbox_never_combines_scripts_with_same_origin(self):
        source = "\n".join(
            path.read_text(encoding="utf-8")
            for path in (ROOT / "src").rglob("*.tsx")
        )
        self.assertNotIn("allow-scripts allow-forms allow-same-origin", source)
        self.assertNotIn("allow-scripts allow-same-origin", source)


if __name__ == "__main__":
    unittest.main()
