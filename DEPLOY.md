# Deploying to Netlify

This guide walks you through deploying the Code Time Capsule app to Netlify.

## Prerequisites

1. A Netlify account (sign up at https://app.netlify.com/signup)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database (can be provisioned through Netlify or external)

## Steps for Deployment

### 1. Prepare Your Repository

Make sure your repo contains:
- All application code
- `netlify.toml` file (already configured)
- `.env.example` file (to reference needed variables)
- Ensure `.env` is in `.gitignore`

### 2. Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your Code Time Capsule repository

### 3. Configure Build Settings

Netlify should automatically detect the correct settings from your `netlify.toml` file:
- Build command: `npm run build`
- Publish directory: `.next`

### 4. Set Up Environment Variables

Add the following environment variables in Netlify settings:

1. Go to Site settings > Build & deploy > Environment variables
2. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: A random string for NextAuth
   - `NEXTAUTH_URL`: Your Netlify deployment URL (e.g., https://your-site-name.netlify.app)
   - `ENCRYPTION_SECRET`: A random string for server-side encryption
   - Add any OAuth provider credentials if using social login

### 5. Set Up PostgreSQL Database

#### Option 1: Netlify PostgreSQL
1. Go to Netlify > Add-ons > Netlify PostgreSQL
2. Follow the setup instructions
3. Environment variables will be automatically added

#### Option 2: External PostgreSQL (e.g., Supabase, Neon, etc.)
1. Set up a PostgreSQL database on your chosen provider
2. Get the connection string and add it as `DATABASE_URL` environment variable

### 6. Deploy Your Application

1. Trigger a deploy in Netlify
2. The build will run:
   - `prisma generate` (from postinstall script)
   - NextJS build

### 7. Final Configuration

1. Set up any custom domains if needed
2. Configure SSL/TLS settings
3. Set up any branch deploy settings for CI/CD

## Troubleshooting

- **Database Connection Issues**: Ensure your database allows connections from Netlify's IP range
- **Build Failures**: Check Netlify build logs for detailed error messages
- **Runtime Errors**: Check Netlify function logs for API errors 