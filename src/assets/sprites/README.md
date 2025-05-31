# Character Sprites

This directory contains character sprite images for the Rick & Morty Dating Simulator.

## Directory Structure

```
sprites/
├── rick/
│   ├── neutral.png
│   ├── happy.png
│   ├── angry.png
│   ├── sad.png
│   ├── flirty.png
│   └── aroused.png
├── morty/
│   ├── neutral.png
│   ├── happy.png
│   ├── angry.png
│   ├── sad.png
│   ├── flirty.png
│   └── aroused.png
├── evil_morty/
│   ├── neutral.png
│   ├── happy.png
│   ├── angry.png
│   ├── flirty.png
│   └── calculating.png
└── rick_prime/
    ├── neutral.png
    ├── happy.png
    ├── angry.png
    ├── sadistic.png
    └── flirty.png
```

## Image Specifications

- **Format**: PNG with transparency (recommended)
- **Size**: 200x300px or similar aspect ratio
- **Style**: Should match Rick & Morty art style
- **Background**: Transparent (the game will add gradient backgrounds)

## How to Add Images

1. Create or obtain character sprite images
2. Name them according to the emotion states listed above
3. Place them in the appropriate character folder
4. The game will automatically load them when available
5. If an image fails to load, the game will fall back to icon representations

## Emotion States

### Rick
- **neutral**: Default standing pose
- **happy**: Genuine smile or laugh
- **angry**: Angry expression
- **sad**: Depressed or contemplative
- **flirty**: Smirking or seductive
- **aroused**: Intense or passionate

### Morty
- **neutral**: Nervous default pose
- **happy**: Excited and bright
- **angry**: Standing up for himself
- **sad**: Vulnerable, about to cry
- **flirty**: Blushing, trying to be smooth
- **aroused**: Completely flustered

### Evil Morty
- **neutral**: Cold calculation
- **happy**: Chilling predatory smile
- **angry**: Controlled terrifying rage
- **flirty**: Manipulative charm
- **calculating**: Plotting something sinister

### Rick Prime
- **neutral**: Malevolent superiority
- **happy**: Joy from others' suffering
- **angry**: Apocalyptic wrath
- **sadistic**: Enjoying pain he causes
- **flirty**: Predatory seduction

## Notes

- Images are loaded from `/src/assets/sprites/[character]/[emotion].png`
- The system supports hot-reloading - add images while the dev server is running
- Missing images will automatically fall back to icon representations
- All images should maintain consistent sizing and style for best results