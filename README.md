# Code Time Capsule

A digital platform where users can encapsulate code (snippets, scripts, or full projects) with a scheduled unlock date, optionally sharing it with others once unlocked.

## Features

- 🔒 **Secure Encryption**: Client-side AES-256 encryption keeps your code private until unlock date
- 📅 **Time-Based Unlocking**: Set a future date for your code to become accessible
- 👥 **Flexible Sharing**: Choose between private, shared, or public access upon unlocking
- 💻 **Syntax Highlighting**: Support for multiple programming languages
- 🔐 **Passphrase Protection**: Access your capsule with a memorable passphrase
- 🌐 **Public Feed**: Browse and learn from unlocked public capsules

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with multiple providers (credentials, GitHub, Google)
- **Code Editor**: Monaco Editor (same as VS Code)
- **Encryption**: CryptoJS (AES-256)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/code-time-capsule.git
   cd code-time-capsule
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your database URL and other configuration

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Capsule

1. Sign up or log in to your account
2. Click on "Create New Capsule"
3. Enter your code, set an unlock date, and create a passphrase
4. Choose your sharing preferences
5. Click "Seal This Capsule"

### Unlocking a Capsule

1. Go to "My Capsules" when the unlock date arrives
2. Enter your passphrase to decrypt the content
3. View, share, or edit your code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Monaco Editor for the code editing experience
- NextAuth.js for authentication
- Tailwind CSS for styling
- Prisma for database access 