# Color Region Meshes

This directory contains 3D mesh files that define color regions in the RGB color space for conceptual space visualization.

## Coordinate System

All meshes use normalized RGB coordinates in the range [0, 1]:

- **X-axis (Red):** 0 = no red, 1 = full red
- **Y-axis (Green):** 0 = no green, 1 = full green
- **Z-axis (Blue):** 0 = no blue, 1 = full blue

The color space is represented as a unit cube from (0,0,0) to (1,1,1), where each point corresponds to an RGB color value.

## File Format

Meshes are stored in Wavefront .obj format with:
- Vertices (`v x y z`) defining points in 0-1 normalized RGB space
- Faces (`f v1 v2 v3`) defining triangles (indexed from 1)

## Requirements

- Meshes should be **watertight** (closed, no holes) for accurate point-in-mesh detection
- All coordinates must be in the range [0, 1]
- Faces should be defined in counter-clockwise winding order (optional, for consistency)

## Current Meshes

### apple-red.obj
Defines the color region for red apples:
- Red (R): 0.6 - 1.0 (high red intensity)
- Green (G): 0.0 - 0.4 (low to medium green)
- Blue (B): 0.0 - 0.3 (low blue)

This captures the typical red/reddish-orange colors of red apples.

### apple-green.obj
Defines the color region for green apples:
- Red (R): 0.0 - 0.4 (low red)
- Green (G): 0.6 - 1.0 (high green intensity)
- Blue (B): 0.0 - 0.3 (low blue)

This captures the typical green/yellowish-green colors of green apples.

## Creating New Meshes

To create a new color region mesh:

1. Define the region in normalized RGB space (0-1 range)
2. Create a watertight mesh covering the desired color region
3. Save as .obj file in this directory
4. Reference the mesh path in the dictionary JSON file

Simple box meshes can be created manually or with a script. For more complex regions, use a 3D modeling tool like Blender to sculpt the shape in the 0-1 coordinate space.

## Usage in Dictionary

Reference these meshes in dictionary JSON files:

```json
{
  "color": {
    "colorRegions": [
      {
        "meshPath": "/models/color-regions/apple-red.obj"
      },
      {
        "meshPath": "/models/color-regions/apple-green.obj"
      }
    ]
  }
}
```

## Performance Considerations

- Keep triangle count reasonable (hundreds, not thousands) for real-time rendering
- Simple convex shapes perform better than complex concave meshes
- The point-in-mesh algorithm uses ray casting with AABB optimization
- Target: <500ms texture generation for 64³ voxel grid
