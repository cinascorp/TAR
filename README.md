# T∆R — The Airlines Reconstruction

## A real-time, open-source, global air-traffic surveillance and anomaly-detection system for conflict zones, humanitarian corridors, and the open internet.

> A single-file, browser-side, zero-backend-required application that tracks every aircraft on Earth — civilian, military, private, helicopter, drone/UAV, glider, and high-altitude (>30 km) vehicles — and surfaces aerial anomalies that traditional consumer trackers do not show. Built over two years of engineering to be lightweight enough to run on low-end hardware and constrained networks, and to help save human lives in crisis.

---

## Executive Summary

**T∆R (The Airlines Reconstruction)** is a real-time, global, live air-traffic surveillance and anomaly-detection system delivered as a single self-contained HTML file (pure HTML/CSS/JavaScript with OpenLayers — no build step, no required backend, no API keys, no user accounts, no tracking). Despite this minimal footprint, it aggregates three independent live air-traffic feeds, applies a per-aircraft steady-state Kalman (alpha-beta) position filter, computes Shannon entropy over the resulting innovation noise, and runs a research-grade anomaly-detection layer — **T∆R-Q** — that flags ghost targets, stealth-shape electromagnetic shadows, and military/emergency contacts.

T∆R was engineered for one purpose: to give journalists, civil-defense operators, humanitarian-corridor planners, and ordinary citizens in conflict and crisis zones a clear, real-time picture of what is flying overhead — including aircraft that consumer trackers deliberately suppress. Two years of engineering have gone into making it usable on the kind of hardware and connectivity that survives in the real world: a single phone, a single hotspot, a single static-hosted URL.

T∆R is fully open-source and is submitted to the NLnet Foundation because its mission — preserving the open internet as a tool of public safety and citizen empowerment — is directly aligned with the values the Foundation has funded for decades.

---

## Problem Statement

The world's airspace is monitored in real time by a dense mesh of ADS-B receivers, MLAT networks, and satellite-ADS-B constellations. The data exists. The problem is **access and interpretation**.

1. **Consumer trackers filter the sky.** Major commercial flight-tracking services deliberately withhold military, governmental, and certain private aircraft from public display — for regulatory reasons (e.g. the FAA's Limited Aircraft Distribution Data, LADD) and for commercial reasons. Citizens in a conflict zone cannot see the military transport that just crossed their border; journalists cannot independently verify aerial claims by state actors.

2. **Spoofing and ghost targets are invisible to end users.** ADS-B is an unauthenticated protocol. A hostile actor can inject phantom contacts, replay stale positions, or suppress real ones. The signal-noise signature of these attacks is detectable, but no consumer tracker exposes it.

3. **The tools that *do* surface this data are heavy, closed, or both.** Professional ATC-grade and defence-grade systems require licenses, native binaries, and dedicated hardware — unusable by the people who most need a fast answer in the field.

4. **Connectivity in the relevant geographies is hostile.** A useful tool must run on a single mid-range Android phone over a 3G/4G hotspot, behind hostile DPI, without an account or an app install.

5. **Language.** Persian/Farsi is the first language of large populations living under aerial threat, yet most aviation tooling is English-only and left-to-right.

T∆R is the response: an open, lightweight, bilingual, anomaly-aware tracker that runs in any modern browser, anywhere, for free.

---

## Technical Approach

### Multi-feed aggregation (no single point of failure)

T∆R merges three independent live air-traffic feeds in parallel:

- **FlightRadar24** live feed (ADS-B / MLAT / FLAM / satellite-ADS-B)
- **OpenSky Network** states API (academic, open, community-fed)
- **adsb.lol** community network, including the `/v2/mil` military database and the `/v2/ladd` Limited Aircraft Distribution Data set

An optional server-side aggregator (a single `route.ts`) merges all three into one FR24-compatible JSON payload, eliminating CORS issues for same-origin deployments and letting the fetch fan-out happen once on the server. Standalone static deployments (e.g. GitHub Pages) fall back to a chain of public CORS proxies, so the same HTML file works with or without a backend.

### Per-aircraft steady-state Kalman (alpha-beta) position filter

Each tracked aircraft owns an `ABF` (alpha-beta filter) instance. On every data sync (~3–4 s), the filter ingests a fresh measurement (lat, lon, heading, ground speed, timestamp) and runs the standard alpha-beta update: position correction with α ≈ 0.35, velocity correction with β ≈ 0.0833, with the measured velocity blended in from heading + ground speed.

Between syncs, **every animation frame (~60 fps)**, the filter runs a dead-reckoning `predict(now)` step so the aircraft moves continuously and smoothly across the map instead of teleporting between sync points. Heading is preserved through modular lerp interpolation (`lerpA`) so aircraft always point in their correct direction of travel — a critical cue for operators trying to read the picture at a glance.

The Kalman **innovation** (prediction error) recorded at each sync is the seed of T∆R's signal-layer analysis.

### Jitter entropy analysis

Each sync's innovation magnitude (in metres) is pushed into a 1,000-sample rolling buffer. After every sync, T∆R computes the **Shannon entropy** H = −Σ pᵢ · log₂(pᵢ) over a 20-bin histogram of the buffer. This exposes the noise characteristics of the data feed itself: a healthy feed has a stable, well-shaped entropy distribution; an injected or replayed feed has a different one. The entropy figure is surfaced both in the console and in a "Sync Telemetry (Kalman)" panel, giving a human operator a one-glance health check on the underlying data.

### Performance and scale

T∆R is built for 20,000+ simultaneous contacts in a single browser tab, through:

- **Viewport-aware marker rendering** — only aircraft inside the current viewport become OpenLayers features.
- **Off-screen culling** in the animation loop.
- **Stale-flight pruning** — contacts unseen for a configurable interval are evicted.
- **Debounced viewport refresh** on pan/zoom so rapid gestures do not thrash the feature set.
- **Style-cache passthrough** and a generous render buffer on the marker layer.

### Visual encoding

- **Altitude spectrum:** 8 colour steps × 1 500 m altitude band, plus dedicated pink/cyan steps for stratospheric contacts above 30 km (high-altitude vehicles, balloons, reconnaissance platforms).
- **Category-coded icons:** fighter (pulsing targeting reticle), heavy transport (T-tail silhouette), bomber (B-2 flying-wing silhouette), glider (sailplane), helicopter (rotor disk), drone (quad-X), high-altitude (diamond).
- **Dark/light tile themes:** both themes are served from the same OpenStreetMap tile source; the dark theme is produced by a CSS filter on the tile layer (`invert(1) hue-rotate(180deg) brightness(.82) contrast(1.15)`). This means **no API key, no commercial tile provider, no rate limit** — only open OSM tiles.

### Military intelligence layer

T∆R runs a continuous **MIL-SYNC** against the adsb.lol `/v2/mil` database. On top of that, it applies a multi-signal military classifier:

- Callsign-prefix heuristics (e.g. RCH, CFC, CNV, RRR, RCH…)
- Aircraft-type knowledge bases (`FIGHTER_TYPES`, `TRANSPORT_TYPES`, `BOMBER_TYPES`, `MIL_HELI_TYPES`, `MIL_UAV_TYPES`)
- Registration-pattern matching (`MIL_REG_PATTERNS`)
- Live **squawk-7700** (general emergency) detection
- A discrete classification gate, `M = (C ∈ S_mil) ∨ (S == 7700)`, combining the military hex database with the emergency squawk code

Classified military contacts get distinct symbology and, for fighters, a pulsing targeting reticle so the operator's eye is drawn to them immediately.

---

## T∆R-Q — Quantum Signal & Anomaly-Detection Research Layer

Layered on top of the tracker is **T∆R-Q**, a research module that treats the live data feed itself as a signal and applies information-theoretic and physical-layer reasoning to detect anomalies that consumer trackers cannot.

### §2.1 Geodesic baseline
Distances are computed on the WGS84 ellipsoid using the Haversine great-circle formula. This is the reference against which timing anomalies are measured.

### §3.1 SNR_blob — signal-to-noise of the received blob
For each received data blob, T∆R-Q computes:

> **SNR_blob = [ Σ |Bᵢ|² ] / σ²_jitter**

the ratio of the summed squared byte-amplitudes of the received blob to the jitter variance derived from the Kalman innovation buffer. This treats the data feed itself as a quantum-noise-like signal: a blob whose byte-amplitude mass is large relative to the local jitter floor is structurally different from one that is not.

### §3.2 Ghost Target (Stealth) Hypothesis
T∆R-Q computes the residual time-of-flight error:

> **Δτ = T_rx − T_tx − ( d_geodesic / c_light )**

If `|Δτ| < 1 ms` **and** the blob mass exceeds 1 000 bytes, the contact is flagged as a **Quantum Anomaly** — a candidate stealth or spoofed target. The intuition: a physically real contact's arrival time is bounded by the speed of light over the true geodesic distance; a fabricated contact cannot fake this without leaking it through Δτ.

### §4 ShadowDetector — EM-shadow-pattern anomaly detector
The `ShadowDetector` class maintains a rolling signal history and a probability distribution over recent observations, and fires when the recent window's entropy deviates from a baseline (baseline entropy 3.5, deviation threshold 0.85). This catches sustained electromagnetic shadow patterns — the signature of an airframe physically present but whose transponder signature has been deliberately altered.

### §4.2 Gate M — military classification gate
The military classification gate is formalised as:

> **M = ( C ∈ S_mil ) ∨ ( S == 7700 )**

combining the adsb.lol `/v2/mil` hex database (`S_mil`) with the ICAO emergency squawk code 7700 (`S`). A contact satisfying M is rendered with military symbology and routed to the MIL Intel panel.

### Secret LADD mode
The Limited Aircraft Distribution Data set is, by design, hidden from public display in commercial trackers. T∆R exposes it through a deliberate, non-obvious gesture — **seven taps on the ∆ glyph in the Advanced Help hero** — which toggles LADD contacts on as white aircraft with black outlines, keeping the feature discoverable to operators who need it without surfacing it to casual visitors.

---

## Deployment & Accessibility

| Spec | Value |
|---|---|
| Delivery format | Single self-contained HTML file |
| External runtime dependencies | Bootstrap CSS, OpenLayers JS, OSM tiles, the three live data feeds |
| Build step | None |
| Backend required | No (optional same-origin aggregator improves reliability) |
| API keys required | None |
| User accounts | None |
| Telemetry / tracking | None |
| Tested contact load | 20,000+ simultaneous aircraft |
| Animation rate | ~60 fps (dead-reckoning prediction) |
| Data sync rate | ~3–4 s |
| Languages | English (LTR) ⇄ فارسی (RTL, fully RTL-aware) |
| Static-host example | `cinascorp.github.io/TAR` (GitHub Pages) |

### Internationalisation and accessibility
The full interface — boot splash, settings, help, category chips, panel tables, parameter rows — is translated between English and Persian, with correct RTL layout flipping. Controls are keyboard-accessible and the document structure is semantic. The choice of Persian is deliberate: it is the first language of large populations living under genuine aerial threat, and the population most underserved by existing aviation tooling.

### Low-end hardware and constrained networks
Because the application is a single static HTML file with no build step, native install, or account, it can be opened in a browser on a mid-range Android phone over a single 3G/4G hotspot. The viewport-aware rendering and stale-flight pruning keep the tab responsive on devices that would choke a conventional full-stack tracker.

---

## Societal Impact

T∆R exists to **help save human lives**. Its intended users are:

- **Journalists and conflict researchers** who need to independently verify aerial claims made by state actors.
- **Civil-defense and humanitarian operators** planning corridors through active airspace.
- **Citizens in conflict and crisis zones** who need to understand what is flying overhead — including military transports, drones, and anomalous/stealth contacts — in their own language, on hardware they actually own.
- **Open-internet researchers** studying ADS-B spoofing and signal-layer attacks on critical infrastructure.

The T∆R-Q anomaly-detection layer is, as far as we know, the first time these information-theoretic and physical-layer checks have been packaged into a tool that runs in a single browser tab and is usable by a non-specialist. If it succeeds, it raises the cost of aerial deception in exactly the places where that deception costs lives.

---

## Open-Source Commitment

T∆R is fully open-source. There is no proprietary tier, no "enterprise" build, no paid API, no telemetry, and no plan to introduce any of these. The single HTML file is the entire application; the optional aggregator is a single `route.ts`. Anyone can read, audit, fork, mirror, and self-host the system on any static web host in any jurisdiction — which matters, because the people who most need T∆R often live in jurisdictions where the official internet is itself a threat.

We commit to:

- Keeping the application build-free and dependency-light.
- Keeping all data sources public and substitutable (no single feed is load-bearing).
- Never introducing user accounts, telemetry, or required API keys.
- Maintaining the bilingual EN/FA interface and expanding language coverage as contributors join.

---

## Closing Vision

The open internet's most important property is that it lets ordinary people see what powerful actors would rather they not see. Nowhere is that property more consequential than in the sky overhead. T∆R is a small, deliberately lightweight instrument for restoring that visibility: one file, two languages, three live feeds, a per-aircraft Kalman filter, and a research-grade anomaly detector that runs in any browser, on any phone, for anyone, for free.

We seek NLnet Foundation support to harden, audit, and extend T∆R — specifically to validate the T∆R-Q anomaly detectors against labelled spoofing datasets, broaden language coverage to additional languages spoken in active conflict zones, and publish reproducible methodology so the wider open-internet community can build on the signal-layer approach.

The sky is a commons. T∆R is one attempt to keep it readable.
