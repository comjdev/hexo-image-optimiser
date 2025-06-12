# hexo-image-optimiser

A Hexo plugin that automatically optimizes images in your blog's public directory using Sharp.

## Features

- Automatically optimizes images after Hexo generates your site
- Supports JPEG, PNG, GIF, and SVG formats
- Resizes large images while maintaining aspect ratio
- Preserves original files by creating optimized versions
- Configurable quality settings
- Detailed optimization statistics

## Installation

```bash
npm install hexo-image-optimiser --save
```

## Configuration

Add the following configuration to your `_config.yml`:

```yaml
image_optimiser:
  quality: 80 # Image quality (0-100)
  webp: true # Enable WebP conversion
  avif: false # Enable AVIF conversion
```

## Usage

The plugin automatically runs after Hexo generates your site. It will:

1. Scan the public directory for images
2. Create optimized versions of each image
3. Display optimization statistics

## Options

- `quality`: Image quality (0-100, default: 80)
- `webp`: Enable WebP conversion (default: true)
- `avif`: Enable AVIF conversion (default: false)

## License

MIT
