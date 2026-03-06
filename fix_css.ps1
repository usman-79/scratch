$f = "c:\Users\user\.gemini\antigravity\scratch\styles.css"

# Read the file as-is
$content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Find where the corruption starts
$cutIdx = $content.IndexOf("/* Catchy Budget")
if ($cutIdx -lt 0) {
    # Try finding with the null-byte prefix character
    $cutIdx = $content.LastIndexOf("/* Catchy Budget")
}

Write-Host "Cut index: $cutIdx"
Write-Host "Content length: $($content.Length)"

if ($cutIdx -gt 0) {
    $cleanPart = $content.Substring(0, $cutIdx)
} else {
    # fallback: keep first 22000 chars (before corruption)
    $cleanPart = $content.Substring(0, [Math]::Min(22000, $content.Length))
}

$newCSS = @"

/* Weightless Investment Console Styles */
.weightless-budget-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5rem;
    perspective: 1000px;
    z-index: 10;
}

.floating-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: #94a3b8;
    text-transform: uppercase;
    margin-bottom: 2rem;
    animation: floatLabel 8s ease-in-out infinite;
    text-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.floating-slab {
    background: linear-gradient(145deg, #ffffff, #f0f2f5);
    padding: 1.8rem 3.5rem;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    transform: rotateX(5deg);
    box-shadow:
        inset 1px 1px 0 rgba(255,255,255,1),
        inset -2px -2px 5px rgba(166,175,194,0.15),
        0 10px 30px rgba(0,0,0,0.02);
    animation: floatSlab 8s ease-in-out infinite;
    transition: transform 0.3s ease;
    border: 1px solid rgba(255,255,255,0.8);
}

.floating-slab:hover {
    transform: rotateX(0deg) translateY(-8px) scale(1.02);
}

.slab-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    transform: translateZ(10px);
}

.icon-well {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #eef2f6 0%, #e2e8f0 100%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:
        inset 3px 3px 6px rgba(166,175,194,0.2),
        inset -2px -2px 4px rgba(255,255,255,1),
        0 4px 10px rgba(0,0,0,0.05);
    border: 1px solid rgba(255,255,255,0.5);
}

.metallic-icon {
    font-size: 1.6rem;
    font-weight: 700;
    background: linear-gradient(180deg, #94a3b8 20%, #475569 50%, #94a3b8 80%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 1px 0 rgba(255,255,255,0.7));
}

.budget-text {
    font-size: 2.5rem;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.04rem;
    text-shadow: 0 1px 1px rgba(255,255,255,0.5);
}

.slab-shadow {
    position: absolute;
    bottom: -80px;
    width: 50%;
    height: 30px;
    background: radial-gradient(ellipse at center, rgba(15,23,42,0.12) 0%, transparent 60%);
    filter: blur(25px);
    opacity: 0.5;
    animation: shadowPulse 8s ease-in-out infinite;
    transform: rotateX(60deg) scaleY(0.5);
    pointer-events: none;
}

@keyframes floatSlab {
    0%, 100% { transform: translateY(0px) rotateX(5deg); }
    50% { transform: translateY(-20px) rotateX(3deg); }
}

@keyframes floatLabel {
    0%, 100% { transform: translateY(0px) translateZ(40px); }
    50% { transform: translateY(-10px) translateZ(40px); }
}

@keyframes shadowPulse {
    0%, 100% { opacity: 0.5; transform: scale(1) rotateX(60deg); }
    50% { opacity: 0.3; transform: scale(0.85) rotateX(60deg); }
}

@media (max-width: 768px) {
    .floating-slab {
        padding: 1.5rem 2rem;
        border-radius: 20px;
    }
    .budget-text { font-size: 1.6rem; }
    .icon-well { width: 44px; height: 44px; }
    .floating-label { margin-bottom: 2rem; font-size: 0.65rem; }
}
"@

[System.IO.File]::WriteAllText($f, $cleanPart + $newCSS, [System.Text.Encoding]::UTF8)
Write-Host "Done! File fixed and rewritten as clean UTF-8."
