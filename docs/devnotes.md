# Nice

## Project structure

This is a monorepo consisting of:

- Typescript modules in `/apps` and `/libs`. Organized with nx.
- Python modules (poetry) in `/modules`.

Initialization:

```bash
yarn install
cd modules/nice-lights/
poetry install
cd ../nice-camera/
poetry install
```

# Misc

## Starting nice-blog

```bash
yarn nx serve nice-blog
```

Open http://localhost:4200.

## Mapping leds in 2d space

```bash
old/nice-camera/src/uvicorn main:app  --port 8000
old/nice-lights/src/uvicorn main:app  --port 8001
yarn nx serve nice-mapping
```
