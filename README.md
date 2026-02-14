# Lensboxd

<p align="center">
  <img src="https://img.shields.io/badge/Letterboxd-FF8000?style=flat&logo=letterboxd&logoColor=white" alt="Letterboxd" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

**Lensboxd** is a curated movie recommendation web application designed for cinephiles. Discover your next favorite film with personalized recommendations based on your Letterboxd profile or hand-picked seed movies.

🔗 **Live Demo**: [https://lensboxd.site](https://lensboxd.site)

## ✨ Features

- **🔮 Letterboxd Integration** - Connect your Letterboxd username for tailored recommendations
- **🎬 Seed Movie Recommendations** - Select movies you love to discover similar films
- **🎯 Random Movie Picker** - Let our spin wheel decide your next watch
- **🎭 Curated Discovery** - Sophisticated algorithms analyze your taste profile
- **📱 Responsive Design** - Seamless experience on desktop and mobile
- **🌙 Cinematic UI** - Dark, immersive interface inspired by film culture

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [React](https://reactjs.org/) 18+ |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Routing | [React Router](https://reactrouter.com/) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) |
| Data Fetching | [React Query](https://tanstack.com/query/latest) |
| Icons | [Lucide React](https://lucide.dev/) |

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/unedtamps/lensboxd.git
   cd lensboxd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔌 API Configuration

Lensboxd requires the [Movie-API](https://github.com/unedtamps/api-movie-muse) backend to fetch movie data and recommendations.

1. Clone and set up the API server
2. Ensure it's running on port `5000`
3. The frontend will automatically connect to the local API

## 🎨 Customization

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

### Theming

The application uses a custom cinematic color palette defined in:
- `tailwind.config.ts` - Color tokens and animations
- `src/index.css` - CSS variables and custom styles

## 🌐 SEO Features

Lensboxd is built with SEO best practices:

- ✅ Semantic HTML structure
- ✅ Open Graph / Twitter Card meta tags
- ✅ Structured data (Schema.org)
- ✅ Optimized meta descriptions and keywords
- ✅ Canonical URLs
- ✅ Responsive design for mobile-first indexing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Data provided by [Letterboxd](https://letterboxd.com/)
- Movie metadata from various public sources
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

<p align="center">
  Made with 🎬 by film lovers, for film lovers
</p>

**Disclaimer**: Lensboxd is not affiliated with or endorsed by Letterboxd. Letterboxd is a trademark of Letterboxd Limited.
