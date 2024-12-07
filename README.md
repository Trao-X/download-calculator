# ![Project Icon](https://github.com/user-attachments/assets/023de591-8070-48c9-841c-83923fa4d07d) Download Calculator

A user-friendly web application to calculate estimated download times based on file size, current progress, and internet speed. The application features a clean interface, supports light/dark mode, and provides a history of previous calculations.

## Features

- **Dynamic Light/Dark Mode:** Automatically detects system theme preferences or allows manual toggling.
- **Download Time Calculator:** Enter total file size, downloaded size, and speed to calculate the remaining time.
- **Unit Conversion:** Supports multiple units for file size (GB, MB, TB) and speed (Mbps, Kbps, Gbps).
- **Download History:** Keeps a list of the last 10 calculations with the ability to clear or remove entries.
- **Responsive UI:** Optimized for desktop and mobile viewing.
- **Accessibility:** Includes focus states for enhanced keyboard navigation.

---

## Demo

![Light Mode Screenshot](https://github.com/user-attachments/assets/27248ffb-0676-493b-a071-144ea2755e7d)
![Dark Mode Screenshot](https://github.com/user-attachments/assets/69543f99-4815-407b-82f2-4002621c345c)

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.
- **npm**: Package manager to install dependencies.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Trao-X/download-calculator.git
   cd download-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the app in your browser at [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
.
├── public/
│   └── favicon.ico                 # Favicon for the app
├── src/
│   ├── components/
│   │   └── DownloadCalculator.jsx  # Core logic for the download calculator
│   ├── App.jsx                     # Main app component with theme toggle
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Tailwind CSS styles
├── package.json
├── vite.config.js                  # Vite configuration file
```

---

## Technologies Used

- **Vite**: Lightning-fast build tool for modern web projects.
- **React**: Component-based UI library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide Icons**: Icon set for buttons and indicators.
- **LocalStorage**: Persists theme preferences and download history.

---

## Usage

### Calculate Download Time

1. Enter the **total file size** and select its unit.
2. Enter the **downloaded size** so far.
3. Enter your **download speed** and select its unit.
4. Click "Calculate Download Time" to get the remaining time in minutes or hours.

### Manage History

- Calculations are saved in the **Download History** section.
- Clear the entire history or remove individual entries.

---

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run preview`: Preview the production build.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Commit your changes and open a pull request.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
