"""Static F01 consumer contract checks — migrated to React source."""
from pathlib import Path
import hashlib
import unittest


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
SCHEMA = (
    ROOT
    / "contracts"
    / "career-navigation"
    / "career-navigation-v2.0.0.schema.json"
)
CANONICAL_SHA256 = (
    "b2ec7fe7ae3933771464b7d81e1268c8b374ef17d52a7d3988197708371f9c93"
)


def read_all_tsx() -> str:
    """Concatenate all .tsx/.ts files in src/ for static checks."""
    parts: list[str] = []
    for ext in ("*.tsx", "*.ts"):
        for f in SRC.rglob(ext):
            parts.append(f.read_text(encoding="utf-8"))
    return "\n".join(parts)


ALL_SRC = read_all_tsx()


class StructuredConsumerTests(unittest.TestCase):
    def test_vendored_contract_matches_b_canonical_pin(self):
        canonical_bytes = SCHEMA.read_bytes().replace(b"\r\n", b"\n")
        self.assertEqual(
            hashlib.sha256(canonical_bytes).hexdigest(),
            CANONICAL_SHA256,
        )

    def test_v2_client_exists_and_validates(self):
        """F01: v2 client must import and call validateV2Response."""
        v2_client = (SRC / "shared" / "api" / "v2" / "client.ts").read_text(
            encoding="utf-8"
        )
        self.assertIn("validateV2Response", v2_client)

    def test_ajv_schema_validator_exists(self):
        """F01: AJV validator must load canonical schema."""
        validator = (
            SRC / "shared" / "api" / "v2" / "schema-validator.ts"
        ).read_text(encoding="utf-8")
        self.assertIn("career-navigation-v2.0.0.schema.json", validator)
        self.assertIn("ajv", validator.lower())

    def test_frontend_does_not_parse_llm_text(self):
        """F01: frontend must never parse LLM-generated free text."""
        for forbidden in (
            "parsePercent",
            "技能匹配度:",
            "市场需求度:",
            "综合评分:",
            "text.split",
        ):
            self.assertNotIn(forbidden, ALL_SRC)

    def test_no_innerhtml_in_react_source(self):
        """F01: React source must not use innerHTML."""
        self.assertNotIn(".innerHTML", ALL_SRC)

    def test_evidence_label_uses_recommendation(self):
        """F01: EvidenceLabel must use canonical 'recommendation' enum."""
        label = (
            SRC / "shared" / "ui" / "trust" / "EvidenceLabel.tsx"
        ).read_text(encoding="utf-8")
        self.assertIn("recommendation", label)
        # 'advice' should only appear in CSS token names, not as enum value
        lines = label.splitlines()
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("*"):
                continue
            if "'advice'" in stripped and "--advice" not in stripped:
                self.fail(f"Found non-CSS-token 'advice' in: {stripped}")


if __name__ == "__main__":
    unittest.main()
