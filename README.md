# AirPods Max Website

- This project is part of the Codveda internship as a Front End Engineer. [Internship Offer Letter](https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7324392120541151233)
- Go Check the Youtube Video of the Project. [Youtube Video](https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7324392120541151233)
- the Linkedin Post of the Project. [Linkedin Post](https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7324392120541151233)

## Project Overview
This project is a responsive website showcasing Apple AirPods Max, featuring 3D models, color variants, and interactive elements.

## Screenshots

### Screen Shot of the Project's Interface
<p align="center">
  <img src=https://github.com/adhamhaithameid/airpods-max/blob/46a73cfbeca0d0e70e8f09bc3a28dc8076dda599/1.png alt="Dashboard Screenshot" width="300" height="150">
  <img src=https://github.com/adhamhaithameid/airpods-max/blob/46a73cfbeca0d0e70e8f09bc3a28dc8076dda599/2.png alt="Dashboard Screenshot" width="300" height="150">
  <img src=https://github.com/adhamhaithameid/airpods-max/blob/46a73cfbeca0d0e70e8f09bc3a28dc8076dda599/3.png alt="Dashboard Screenshot" width="300" height="150">
  <img src=https://github.com/adhamhaithameid/airpods-max/blob/46a73cfbeca0d0e70e8f09bc3a28dc8076dda599/4.png alt="Dashboard Screenshot" width="300" height="150">
</p>

### the Task Requirements
![Task Requirements](<Front-End Task List-14_page-0001.jpg>)

## Features

- **Interactive 3D Models**: View AirPods Max in various colors with 3D animations.
- **Color Selection**: Seamlessly switch between different AirPods Max colors.
- **Smooth Horizontal Scrolling**: Optimized GSAP ScrollTrigger for a fluid browsing experience.
- **Dynamic Pricing Section**: Displays pricing information with currency selection.
- **Responsive Design**: Adapts to different screen sizes for an optimal viewing experience on desktop and mobile devices.
- **Integrated Video Section**: Includes a dedicated section for product videos.
- **Enhanced UI/UX**: Improved button interactions, consistent layouts, and refined visual elements.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **GSAP (GreenSock Animation Platform)**: Powerful JavaScript animation library for professional-grade animations.
- **ScrollTrigger (GSAP Plugin)**: Enables scroll-based animations.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Vite**: A fast build tool for modern web projects.

## Setup and Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/adhamhaithameid/airpods-max.git
    cd airpods-max-website
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:5173/`.

## Project Structure

```
airpods-max/
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/             # Product images
│   ├── components/         # Reusable React components (Navbar, AirpodsModel, etc.)
│   ├── data/               # Data files (e.g., variants.js)
│   ├── index.css
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Usage

- Navigate through sections using the navbar.
- Click on color circles to change the AirPods Max variant.
- Interact with the pricing section to see different currency options.
- Explore the videos section for product showcases.
