from pathlib import Path


def replace_exact(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if old not in text:
        raise SystemExit(f"expected text not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")

replace_exact(
    "client/src/lib/TBSoundEngine.ts",
    """    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);
    this.enabled = true;
""",
    """    this.masterGain = this.ctx.createGain();
    // Context preparation is intentionally silent. Audible output is enabled
    // only by the explicit sound control.
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);
""",
)

replace_exact(
    "client/src/lib/TBSoundEngine.ts",
    """  setEnabled(val: boolean) {
    this.enabled = val;
    if (this.masterGain) {
""",
    """  setEnabled(val: boolean) {
    this.enabled = val;
    if (val && this.ctx?.state === \"suspended\") {
      void this.ctx.resume();
    }
    if (this.masterGain) {
""",
)

replace_exact(
    "client/src/components/SoundToggle.tsx",
    "const [muted, setMuted] = useState(false);",
    "const [muted, setMuted] = useState(true);",
)

replace_exact(
    "client/src/components/SoundToggle.tsx",
    """      aria-label={muted ? \"Unmute sounds\" : \"Mute sounds\"}
      title={muted ? \"Turn on sounds\" : \"Turn off sounds\"}
""",
    """      aria-label={muted ? \"Enable sounds\" : \"Mute sounds\"}
      aria-pressed={!muted}
      data-techbridge-sound={muted ? \"off\" : \"on\"}
      title={muted ? \"Enable sounds\" : \"Mute sounds\"}
""",
)

print("TECHBRIDGE_EXPERIENCE_PATCH=APPLIED")
