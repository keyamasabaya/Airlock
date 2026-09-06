#!/usr/bin/env bash
# Construit l'archive a televerser sur le Chrome Web Store.
#
# Le Store attend un zip dont manifest.json est a la RACINE, et refuse tout
# fichier inutile. On n'embarque donc que ce que l'extension execute :
# ni docs, ni roadmap, ni sources legales en Markdown (elles sont publiees
# en HTML sur GitHub Pages, cf. docs/).
#
# Usage : ./package.sh
set -euo pipefail

SRC="airlock-extension"
VERSION=$(python3 -c "import json;print(json.load(open('$SRC/manifest.json'))['version'])")
OUT="airlock-${VERSION}.zip"
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

# fichiers reellement charges par l'extension
cp "$SRC/manifest.json" "$STAGE/"
cp "$SRC/popup.html" "$SRC/popup.js" "$STAGE/"
cp "$SRC/options.html" "$SRC/options.js" "$STAGE/"
cp "$SRC/methodology.html" "$SRC/methodology.js" "$SRC/methodology.css" "$STAGE/"
cp "$SRC/content.js" "$SRC/content.css" "$STAGE/"
mkdir -p "$STAGE/icons"
# seules les tailles declarees dans le manifest
for size in 16 32 48 128; do
  cp "$SRC/icons/icon${size}.png" "$STAGE/icons/"
done

rm -f "$OUT"
(cd "$STAGE" && zip -qr - .) > "$OUT"

echo "Archive : $OUT  ($(du -h "$OUT" | cut -f1))"
echo
echo "Contenu :"
unzip -l "$OUT" | tail -n +4 | head -n -2 | awk '{printf "  %s\n", $4}'
echo
echo "Verification :"
python3 - "$OUT" <<'PY'
import json, sys, zipfile
z = zipfile.ZipFile(sys.argv[1])
names = z.namelist()
m = json.loads(z.read("manifest.json"))
assert "manifest.json" in names, "manifest.json doit etre a la racine"
missing = [p for p in m["icons"].values() if p not in names]
refs = ["popup.html", "options.html", "content.js", "content.css",
        "methodology.html", "methodology.js", "methodology.css"]
missing += [p for p in refs if p not in names]
print("  manifest.json a la racine : OK")
print(f"  manifest_version : {m['manifest_version']}")
print(f"  version : {m['version']}")
print(f"  permissions : {m.get('permissions')} + {m.get('host_permissions')}")
print("  fichiers references manquants :", missing or "aucun")
assert not missing
PY
