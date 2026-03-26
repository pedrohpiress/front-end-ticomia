# Quick Start Guide - JavaScript + Vite Project

## Project Status
✅ TypeScript to JavaScript conversion completed
✅ All 126 files converted successfully
✅ All TypeScript dependencies removed
✅ Project ready for development

## Installation

```bash
# Navigate to project directory
cd c:\Users\pedro\Documentos\ticomia\front-end-ticomia\material-kit-react

# Install dependencies
npm install
# or
yarn install
```

## Development

```bash
# Start development server with hot reload
npm run dev

# The app will be available at:
# http://localhost:3039
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run start
```

## Code Quality

```bash
# Check code with ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Check code formatting with Prettier
npm run fm:check

# Fix formatting with Prettier
npm run fm:fix

# Run both lint:fix and fm:fix
npm run fix:all
```

## Project Structure

```
src/
├── App.jsx                 # Main app component
├── main.jsx                # Entry point
├── components/             # Reusable components
├── layouts/                # Layout components
├── pages/                  # Page components
├── sections/               # Feature sections
├── hooks/                  # Custom React hooks
├── services/               # API services
├── config/                 # Configuration files
├── api/                    # API clients
├── theme/                  # MUI theme
└── _mock/                  # Mock data
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run start` | Preview production build |
| `npm run build` | Build for production |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run fm:check` | Check formatting |
| `npm run fm:fix` | Fix formatting |
| `npm run fix:all` | Lint + format fixes |
| `npm run clean` | Clean node_modules and builds |
| `npm run re:dev` | Clean install + dev |
| `npm run re:build` | Clean install + build |

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Node.js 20 or higher

## Important Notes

- **No TypeScript**: This is now pure JavaScript
- **Vite-powered**: Fast development and build
- **React 19**: Latest React version
- **Material-UI**: Professional components
- **ESM Modules**: Modern module syntax

## Troubleshooting

### Port already in use
```bash
# Use a different port
npm run dev -- --port 3040
```

### Clear cache and reinstall
```bash
npm run clean
npm install
npm run dev
```

### Build issues
```bash
# Clear dist folder and rebuild
rm -rf dist
npm run build
```

## Environment Setup

Create a `.env` file if needed:
```
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Your App Name
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start development: `npm run dev`
3. ✅ Check ESLint: `npm run lint`
4. ✅ Format code: `npm run fm:fix`
5. ✅ Build when ready: `npm run build`

## Support

For issues or questions:
1. Check the git history for original TypeScript versions
2. Review component documentation in code comments
3. Check Material-UI documentation: https://mui.com
4. Check React documentation: https://react.dev
5. Check Vite documentation: https://vitejs.dev

---

**Project**: material-kit-react  
**Type**: React + Vite (JavaScript)  
**Status**: Ready for Development ✅
