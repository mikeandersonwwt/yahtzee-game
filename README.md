# Yahtzee Game 🎲

A modern, web-based implementation of the classic Yahtzee dice game, built with React, TypeScript, and Vite. This project showcases frontend development skills, AI opponent implementation, and automated CI/CD deployment using GitHub Actions.

**[Play the Game Live](https://mikeandersonwwt.github.io/yahtzee-game/)**

## Project Overview

This Yahtzee game is a fully functional web application that demonstrates:

- **Modern React Development**: Built with React 19, TypeScript, and Vite for optimal performance
- **Responsive UI/UX**: Clean, intuitive interface styled with Tailwind CSS
- **Game AI**: Strategic computer opponent that makes intelligent decisions
- **State Management**: Complex game state handling with React hooks
- **Automated Deployment**: CI/CD pipeline using GitHub Actions for seamless deployment to GitHub Pages

## Features

### Game Modes
- **Single Player**: Play solo and try to achieve the highest score possible
- **Vs Computer**: Compete against an AI opponent that makes strategic decisions based on probability and game state

### Interactive Gameplay
- **Click-to-Hold Dice**: Intuitive dice holding mechanism - click to hold, click again to release
- **Real-Time Score Preview**: See potential scores for each category before committing
- **In-Game Instructions**: Built-in "How to Play" modal with complete game rules and scoring information
- **Visual Feedback**: Clear indicators for held dice, available categories, and current player turn

### Technical Highlights

#### AI Implementation
The computer opponent uses a strategic decision-making algorithm that:
- Evaluates all possible scoring combinations
- Prioritizes high-value categories (Yahtzee, Large Straight, Full House)
- Makes intelligent dice-holding decisions based on probability
- Adapts strategy based on remaining categories

#### Automated Deployment
This project uses GitHub Actions for continuous deployment:
- **Automated Build**: TypeScript compilation and Vite bundling on every push to main
- **GitHub Pages Deployment**: Automatic deployment to live site
- **Clean Install Strategy**: Handles npm dependency issues with fresh installs
- **Manual Trigger Option**: Workflow can also be triggered manually from GitHub Actions tab

The deployment workflow includes:
- Node.js 20 environment setup
- Clean dependency installation to avoid optional dependency issues
- Production build optimization
- Automated artifact upload and deployment to GitHub Pages

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Deployment**: GitHub Pages via GitHub Actions
- **Development**: ESLint for code quality

## How to Run Locally

### Prerequisites

- Node.js (v20 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikeandersonwwt/yahtzee-game.git
   cd yahtzee-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` to play the game

5. **Stop the server**
   
   Press `Ctrl+C` in the terminal, or run:
   ```bash
   pkill -f "vite"
   ```

## Screenshots

![Yahtzee Game Screenshot 1](yahtzee1.png)

![Yahtzee Game Screenshot 2](yahtzee2.png)

## Acknowledgments

This repository was built by me with assistance from AI coding tools for planning, implementation support, and documentation refinement.

## Disclaimer

This is an independent educational and portfolio project. It is not affiliated with, endorsed by, or sponsored by Hasbro, Inc. or any other official Yahtzee trademark holder.
