# TrustPilot AI — Deployment Guide & Production Configuration

## 1. Local Development Setup
```bash
# Clone the repository
git clone https://github.com/Ravibbk/trustpilot-ai.git
cd trustpilot-ai

# Install dependencies
npm install

# Run automated tests
npm test

# Launch development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Docker Containerization
A multi-stage production Dockerfile is included:
```bash
# Build Docker image
docker build -t trustpilot-ai:latest .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production trustpilot-ai:latest
```

Using Docker Compose:
```bash
docker compose up -d
```

---

## 3. Production Environment Variables
Create `.env.production` (see `.env.example`):
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/trustpilot_ai
JWT_SECRET=super_secret_production_key_minimum_32_characters
NEXT_PUBLIC_APP_URL=https://trustpilot-ai.example.com
```

---

## 4. Cloud Deployment Options
- **Vercel:** Single-click zero-config Next.js deployment.
- **Render / Railway / Fly.io:** Node.js standalone server with automated HTTPS and Docker support.
- **AWS / GCP:** ECS / Cloud Run with managed PostgreSQL (RDS / Cloud SQL).

