# TAR — The Airline Reconstruction

A client-side flight reconstruction and visualization prototype that blends geospatial tracking, temporal smoothing, and signal-based anomaly ideas into a browser-first experience.

Live demo: https://cinascorp.github.io/TAR/

## Overview

TAR explores a browser-native approach to aerial monitoring:

- real-time map rendering in the browser
- lightweight SVG flight markers instead of expensive canvas-heavy redraws
- theme-aware UI for day/night operation
- flight filtering by category and source
- simulated motion with smoothing, heading, and track trails
- clear separation between geodesic, temporal, and signal analysis ideas

This project is intentionally lightweight and easy to run locally without a build pipeline.

## Why this project exists

Traditional flight visualization stacks are usually dominated by server-side pipelines and heavy rendering systems. TAR experiments with an alternative model:

- browser as the visualization and sensor node
- OpenLayers for spatial context
- SVG for high-quality, lightweight aircraft icons
- modern UI for operational clarity
- data model suitable for extension with live sources, filters, and telemetry

## Features

- adaptive dark / light / aurora themes
- map with live-style flight overlays
- realistic aircraft SVG icons with category-specific colors
- heading-aware orientation and motion trails
- category filters for civilian, military, drones, and high-altitude objects
- efficient redraw scheduling via requestAnimationFrame
- mobile-friendly floating controls and off-canvas panels

## Architecture

### Geodesic layer

The app uses spherical Earth approximations and map projection logic to place flights correctly in geographic space.

### Temporal layer

Flight position and heading are smoothed to reduce jitter and improve the perceived quality of motion. This is especially useful when working with sparse or uneven incoming telemetry.

### Signal layer

The project also includes a conceptual signal-analysis layer used to reason about anomalies and packet timing irregularities. This is exploratory and not a replacement for production-grade aviation surveillance systems.

## Quick start

1. Clone the repository
2. Open `index.html` directly in a modern browser, or serve the folder locally with a tiny static server
3. If you want a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Local usage notes

- Use a modern browser with WebGL-capable graphics support
- Some map tiles and CDN assets require internet access
- For best performance, use a desktop browser with stable GPU acceleration

## Project structure

```text
.
├── index.html      # main app and styling
├── README.md       # project documentation
└── favicon.ico     # app icon (if present in the repo)
```

## Customization

### Theme tuning

The UI uses CSS variables and a small theme registry in `index.html`.

Edit the `:root` and `body[data-theme="..."]` rules to change:

- background colors
- accent color
- panel surfaces
- borders and shadows
- safe contrast values for readability

### Flight styling

Aircraft visuals are rendered with SVG. The geometry is defined in JavaScript and can be edited in the `buildFlightIcon()` function.

You can tune:

- icon silhouette
- wing span
- tail shape
- glow and shadow
- color by flight category
- track trail style

## Performance notes

The app uses a few design decisions to keep it smooth:

- only visible flights are rendered
- redraws are batched with `requestAnimationFrame`
- SVG groups are created once and updated in place where possible
- map pan / zoom handlers are throttled
- DOM writes are reduced during high-frequency updates

## Known limitations

This is a prototype and not a production radar or ADS-B system. In particular:

- sample flight data is simulated or demo-oriented unless extended with live sources
- map tiles come from public web services and can fail without network access
- the signal-analysis sections are conceptual research notes, not operational detection logic

## Roadmap

Planned improvements include:

- live data source adapters
- clearer filtering and grouping panels
- better per-flight detail popovers
- historical replay mode
- reduced re-render cost for large fleets
- optional WebGL layer for dense visualization

## Contributing

Pull requests are welcome. Recommended areas for contributions:

- better aircraft silhouettes
- more realistic motion smoothing
- additional themes and accessibility fixes
- stronger map clustering for dense areas
- documentation improvements

## License

This repository currently uses the default project licensing settings as defined in the repository. If no explicit license file exists, check the GitHub repository settings before redistributing or commercializing the code.

## Summary

TAR is a browser-first flight visualization experiment that blends map realism, aircraft icon design, UI polish, and conceptual signal processing ideas into a single, accessible project.
