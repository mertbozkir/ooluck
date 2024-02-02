# Configuring a New TFT Set in Match Scraper Project



## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Configuration Steps](#configuration-steps)
    - [1. Fetch New TFT Set’s ID](#1-fetch-new-tft-sets-id)
    - [2. Fetch Metadata JSON](#2-fetch-metadata-json)
    - [3. Copy JSON Files](#3-copy-json-files)
    - [4. Run Parsing Script](#4-run-parsing-script)
    - [5. Update MappingManager Class](#5-update-mappingmanager-class)
- [Testing](#testing)
- [Conclusion](#conclusion)

## Prerequisites

- Access to the project's codebase.
- Basic knowledge of TypeScript and JSON file handling.
- Access to Riot Games Developer API.

## Project Structure

The project is structured with separate folders for different data types:

- `augments`
- `champions`
- `items`
- `traits`

Each folder contains a `.json` file, TypeScript files, and subfolders for `indices` and `names`.

## Configuration Steps

### 1. Fetch New TFT Set’s ID

- Identify the ID of the new TFT set.
- Example ID format: `TFTSet9_2`.

### 2. Fetch Metadata JSON

- Go to the [Riot Games Developer Portal](https://developer.riotgames.com/docs/tft#data-dragon_data-assets).
- Download the metadata JSON files for `augments`, `champions`, `items`, and `traits` for the new TFT set.

### 3. Copy JSON Files

- Place each downloaded JSON file into the corresponding folder in the project:
    - `augments.json` → `./augments/`
    - `champions.json` → `./champions/`
    - `items.json` → `./items/`
    - `traits.json` → `./traits/`

### 4. Run Parsing Script

- Open a terminal and navigate to each folder (`augments`, `champions`, `items`, `traits`).
- Execute the parsing script by running:
  ```
  npx ts-node parse.ts
  ```
- This will parse the JSON files and generate TypeScript files.
- Add the generated files to the `indices` and `names` subfolders, naming them according to the new TFT set, e.g., `set93.ts`.

### 5. Update MappingManager Class

- Open `manager.ts`.
- Modify the `MappingManager` class:
    - Add the new TFT set mapping to `versionMapping`.
    - Update the `default` property to point to the new set.
- This step ensures that the scraper uses the latest set data.

## Testing

- After configuration, run unit tests (if available) to ensure the integration works as expected.
- Manually test the scraper to verify that it correctly pulls data from the new TFT set.

## Troubleshooting

Contact with the author of this document.

**Author:** Oğuz Vuruşkaner  
**GitHub:** [ovuruska](https://github.com/ovuruska)  
**Email:** oguzvuruskaner@gmail.com

## Conclusion

Following these steps will successfully integrate a new TFT set into the match scraper project. For any issues or further customizations, refer to the project’s documentation or contact the development team.
should provide an organized and easily navigable documentation for users and developers.
