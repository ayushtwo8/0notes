# Quick Start Guide

## 🚀 Deploy to Production

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Edit `.env` file:
```env
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-domain.com
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 3: Build Application
```bash
npm run build
```

### Step 4: Start Production Server
```bash
npm start
```

---

## 📋 Deployment Platforms

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically

### Railway/Render
1. Connect repository
2. Set environment variables
3. Deploy

### VPS/Dedicated Server
```bash
# Install PM2
npm install -g pm2

# Build
npm run build

# Start with PM2
pm2 start npm --name "notes-app" -- start

# Save PM2 config
pm2 save
pm2 startup
```

---

## 🔄 Cron Job Setup

### Vercel Cron (if using Vercel)
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-trash",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### External Cron (Alternative)
Use curl to hit the endpoint daily:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/cleanup-trash
```

---

## ✅ Pre-launch Checklist

- [ ] Environment variables set
- [ ] Database connected
- [ ] Build successful
- [ ] Authentication working
- [ ] User registration tested
- [ ] Note creation tested
- [ ] Mobile responsive verified
- [ ] Cron job configured

---

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify MONGODB_URI format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure cookies are not blocked

---

## 📞 Support

For issues, check:
1. Environment variables
2. Database connection
3. Build logs
4. Browser console

---

**Status:** ✅ Ready for Production
