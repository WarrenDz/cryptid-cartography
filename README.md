# Cryptid Cartography

Interactive map-based cryptid hunt built with ArcGIS map components and Vite.

## Project Status

Rough prototype in active development.

## Table of Contents

- Overview
- Features
- Tech Stack
- Getting Started
- Gameplay Flow
- Project Structure
- Data Model
- Map and Layer Notes
- Roadmap
- License

## Overview

Cryptid Cartography is a browser-based exploration game where players navigate a live ArcGIS map and discover hidden cryptid locations.

Current prototype behavior:

- Loads an ArcGIS web map by item id.
- Tracks map center and checks distance to a selected cryptid target.
- Reveals in-map layers and shows a popup card when the player is near a target.
- Supports hash-based hint layer toggles.

## Features

- Proximity detection using Haversine distance.
- Target popup with name, description, and image.
- Layer visibility control by layer id/title/name.
- Hint progression via URL hash (example: #bigfoot-hint1).
- Flashlight/vignette overlay effect.

## Tech Stack

- JavaScript (ES modules)
- Vite
- ArcGIS Maps SDK for JavaScript
- ArcGIS map web components
- CSS

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

## Gameplay Flow

1. The map loads with the configured ArcGIS web map item.
2. A target cryptid is selected from the local target dataset.
3. As the map moves, the app computes distance from map center to target coordinates.
4. If within threshold range, the cryptid layer is revealed and a popup appears.
5. Hint layers can be shown by changing the URL hash.

## Project Structure

```text
.
|- index.html
|- src/
|  |- main.js            # App bootstrapping and target selection flow
|  |- cryptids.js        # Cryptid data definitions
|  |- proximityCheck.js  # Distance math and layer visibility helpers
|  |- popUp.js           # Popup create/show/hide logic
|  |- style.css          # Full-page map, overlay, and popup styles
|- public/
```

## Data Model

Each cryptid entry currently includes:

- key (object key, lowercase)
- name
- description
- image
- hint1
- hint2
- latitude
- longitude

Example shape:

```js
{
	bigfoot: {
		name: 'Bigfoot',
		description: '...',
		image: 'src/assets/bigfoot.jpeg',
		hint1: 'Bigfoot-hint1',
		hint2: 'Bigfoot-hint2',
		latitude: 47.6062,
		longitude: -122.3321
	}
}
```

## Map and Layer Notes

- ArcGIS web map is currently loaded from index.html using arcgis-map item-id.
- Layer matching supports id, title, or name.
- Hint layer naming should stay consistent with cryptid keys and URL hash format.

Planned documentation to add:

- How to publish/edit the backing ArcGIS web map.
- Naming conventions for base cryptid layers and hint layers.
- Recommended layer style presets for clue readability.

## Known Issues

- Target selection UI is not yet implemented.
- Popup content is text-heavy and can overflow on small screens.
- No automated test suite yet.

## License

TBD.