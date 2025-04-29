# Animeter Wildlife Analysis Portal

A comprehensive web application for analyzing camera trap images of wildlife, featuring distance calibration, sequence analysis, and automated motion analysis.

## Overview

Animeter is a specialized platform designed for wildlife researchers, conservationists, and field scientists to process and analyze camera trap images. The portal enables accurate measurement of animal movement, speed calculation, and sequence analysis through an intuitive web interface.

## Features

- **Project Management:** Create and organize wildlife monitoring projects with metadata
- **Image Management:** Upload, tag, and manage camera trap images
- **Distance Calibration:** Precisely calibrate distances in images using reference objects
- **Sequence Analysis:** Group and analyze sequences of animal movements across multiple images
- **Movement Tracking:** Calculate animal speed, distance traveled, and movement patterns
- **Data Export:** Download results in CSV, JSON, or PDF formats for further analysis

## Tech Stack

- **Frontend:** React, Vite, Bootstrap, React Router
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT-based authentication system
- **Image Processing:** Custom algorithms for distance calibration and movement analysis

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/animeter.git
cd animeter/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the frontend directory with:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. The application will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and resources
│   ├── components/   # Reusable UI components
│   │   ├── Analysis/ # Analysis-specific components
│   │   ├── Auth/     # Authentication components
│   │   └── common/   # Shared components
│   ├── context/      # React context providers
│   ├── pages/        # Route-level components
│   └── styles/       # Global styles
└── index.html        # HTML entry point
```

## Workflow

1. **Account Creation:** Register and create a user account
2. **Project Creation:** Set up a new wildlife monitoring project
3. **Image Upload:** Upload camera trap images to the project
4. **Calibration:** Set up distance calibration for accurate measurements
5. **Analysis:** Process images to extract distance, angle, and speed data
6. **Results:** View results and download reports in various formats

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Wildlife conservation organizations for project requirements and feedback
- Camera trap technology providers for technical specifications
- Research institutions for methodology guidance
