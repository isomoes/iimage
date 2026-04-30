# iimage

iimage is an image generation and editing web app built on OpenAI-compatible image APIs. It provides a clean web UI for text-to-image generation, reference-image editing, visual parameter controls, local history management, and local data import/export.

This project is based on the original CookSleep/gpt_image_playground. Thanks to the original project and its contributors for the foundation.

---

## Features

### Core Capabilities

- **Text to image**: Generate images from prompts with either the Images API (`/v1/images`) or the Responses API (`/v1/responses`) `image_generation` tool.
- **Reference image editing**: Upload up to 16 reference images and edit them through `images/edits` or multimodal Responses API input. File selection, paste, and drag-and-drop are supported.
- **Mask editing**: Draw masks on reference images for local edits. The masked source image is preprocessed into a safe working image to avoid submission failures caused by very high resolutions. Note that mask editing is still prompt-guided by the model and cannot fully guarantee the exact edited region.
- **API mode switching**: Choose Images API or Responses API from settings.
- **Batch generation**: Generate multiple images in one task.
- **Codex CLI compatibility mode**: When enabled, quality is fixed to `auto` and the `quality` field is not sent. Images API multi-image generation is split into concurrent single-image requests, which works around unsupported or ignored quantity parameters. Prompts are also prefixed with a short instruction to avoid unwanted prompt rewriting.

### Parameter Controls

- **Smart size picker**: Use `auto`, common ratios with `1K / 2K / 4K`, or custom width and height.
- **Automatic normalization**: Custom sizes are normalized to model-compatible limits: width and height are multiples of 16, the longest side is at most `3840px`, aspect ratio is no more than `3:1`, and total pixels are constrained between `655360` and `8294400`.
- **Preset matching**: The size picker can infer the closest preset from the current dimensions.
- **Output options**: Configure quality (`low`, `medium`, `high`), output format (`PNG`, `JPEG`, `WebP`), compression level (`0-100`), and moderation level.
- **Actual parameter tracking**: API-returned size, quality, format, count, and revised prompt are recorded and highlighted when they differ from the requested values.

### History And Workflow

- **Masonry task cards**: Browse generated thumbnails, prompts, parameters, and elapsed time. Filter by task status or search by keyword.
- **Favorites**: Mark useful records and quickly show only favorites.
- **Bulk selection**: On desktop, select with drag boxes or `Ctrl`/`Cmd` click. On mobile, use left/right swipe selection. Selected records can be favorited, deleted, or selected across the visible list.
- **Quick reuse**: Refill the prompt and settings from any history record.
- **Iterative generation**: Add generated outputs directly back into the reference-image list for another editing pass.
- **Gallery and details**: Open task cards to inspect full inputs and outputs with large-image previews.
- **Image shortcuts**: Right-click on desktop or long-press on mobile to copy, download, or add an image as a reference for continued editing.

### User Experience

- **Responsive layout**: Desktop includes efficient batch selection and a bottom input bar. Mobile includes a collapsible input area and interaction refinements for swipes, selection, and dialogs.
- **PWA support**: Install the app as a Progressive Web App on desktop or mobile for a standalone, app-like experience, including iOS PWA safe-area handling.

### Local-First Data

- **IndexedDB storage**: Task records and image data are stored in the browser's IndexedDB. Your data stays local.
- **Performance optimizations**: Reference images use memory caching and deferred storage. Images are deduplicated with SHA-256 hashes, and orphaned image blobs are cleaned up on startup.
- **Import and export**: Export all data as a ZIP archive containing original image files and a `manifest.json` with image metadata for backup and migration.

---

## Deployment And Usage

The recommended production setup is to build the static files locally, upload the `dist/` directory to your server, and serve it with Caddy. This keeps the frontend fully static while letting Caddy handle HTTPS, compression, caching, and efficient static file delivery with very low overhead.

<details>
<summary><strong>Recommended: Static Build With Caddy</strong></summary>

### Optional Environment Setup

Create `.env.local` in the project root to configure the default build-time API URL:

```bash
VITE_DEFAULT_API_URL=https://api.openai.com/v1
```

### Install And Run

```bash
bun install
bun dev
```

Then open `http://localhost:6677`.

### Build Static Assets Locally

```bash
bun run build
```

The build output is written to `dist/`. Upload this directory to your server, for example to `/var/www/iimage`.

### Serve With Caddy

Use Caddy as the production web server for the best operational simplicity and performance. It provides automatic HTTPS, efficient static file serving, and response compression.

Example `Caddyfile`:

```caddyfile
iimage.example.com {
  root * /var/www/iimage
  encode zstd gzip
  try_files {path} /index.html
  file_server
}
```

After updating files on the server, reload Caddy:

```bash
sudo caddy reload --config /etc/caddy/Caddyfile
```

Then open your domain and enter the API URL and API key in the app settings. iimage sends requests directly to the configured API endpoint, so the endpoint must allow browser access.

</details>

---

## API Configuration

Open the settings panel from the top-right corner to update API-related options.

- **Images API**: Calls `/v1/images/generations` and `/v1/images/edits`. Use a GPT Image model such as `gpt-image-2`.
- **Responses API**: Calls `/v1/responses` with the `image_generation` tool. Use a text model that supports image generation, such as `gpt-5.5`.
- **Codex CLI Mode**: If you use an API derived from Codex CLI, enable this next to `API URL`. The app will stop sending the `quality` parameter, force the UI quality option to `auto`, and add a short instruction to prompts to avoid unwanted prompt rewriting.
- In Codex CLI mode, Images API image count is implemented with concurrent single-image requests. Responses API already uses concurrent requests for multiple images.
- If the app detects that the API rewrote your prompt, it can ask whether to enable Codex CLI mode for the current `API URL + API Key` combination. If dismissed, the same combination will not be prompted again.

URL query parameters can prefill configuration, which is useful for bookmarks or sharing:

- `?apiUrl=https://api.example.com`
- `?apiKey=sk-xxxx`
- `?apiMode=images` or `?apiMode=responses`; default is `images`
- `?codexCli=true` or `?codexCli=false`; default is disabled, and only `true` enables Codex CLI mode

Example:

```text
https://your-iimage-deployment.example.com?apiUrl={address}&apiKey={key}
```

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build tool**: [Vite](https://vite.dev/)
- **Styles**: [Tailwind CSS 3](https://tailwindcss.com/)
- **State management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Data storage**: Browser IndexedDB API

## License

[MIT License](LICENSE)

## Acknowledgements

- Original project: CookSleep/gpt_image_playground
- Community: [LINUX DO](https://linux.do)
