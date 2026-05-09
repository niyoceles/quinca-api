# DigitalOcean Deployment Guide

This guide explains how to deploy and manage the **NaoExpress** and **Hadiwa** projects on a single 1GB RAM DigitalOcean Droplet.

---

## 1. Droplet Host Preparation
Run these commands once on a fresh Ubuntu 22.04 Droplet.

### Update & Infrastructure
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 nginx certbot python3-certbot-nginx -y
```

### Performance Optimization (Mandatory for 1GB RAM)
```bash
# Create 2GB Swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Firewall Security
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

## 2. Project 1: NaoExpress
**Domain**: `naoexpress.com` | **API**: `api.naoexpress.com`

### Deployment
1. **Clone**: `git clone <repo> /var/www/naoexpress`
2. **Backend**:
   - Create `/var/www/naoexpress/Backend/.env`
   - Set `MONGODB_URI=mongodb://mongodb:27017/relayxpress`
   - Run `docker compose up -d --build`
3. **Frontend**:
   - `cd /var/www/naoexpress/Frontend`
   - `VITE_API_URL=https://api.naoexpress.com/api npm run build`

---

## 3. Project 2: Hadiwa
**Domain**: `hadiwa.com` | **API**: `api.hadiwa.com`

### Deployment
1. **Clone**: `git clone <repo> /var/www/hadiwa`
2. **Backend**:
   - Create `/var/www/hadiwa/backend/.env`
   - Set `DATABASE_URL=postgres://postgres:admin@postgres-hadiwa:5432/hadiwa-store`
   - Run `docker compose up -d --build`
3. **Frontend**:
   - `cd /var/www/hadiwa/frontend`
   - `npm install --legacy-peer-deps`
   - `REACT_APP_BACKEND=https://api.hadiwa.com/api npm run build`

---

## 4. Nginx Traffic Control
Create config files in `/etc/nginx/sites-available/` and link them to `sites-enabled`.

### NaoExpress Config
Create `/etc/nginx/sites-available/naoexpress`:
```nginx
server {
    listen 80;
    server_name naoexpress.com www.naoexpress.com;
    root /var/www/naoexpress/Frontend/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
server {
    listen 80;
    server_name api.naoexpress.com;
    location / { proxy_pass http://localhost:5001; }
}
```

### Hadiwa Config
Create `/etc/nginx/sites-available/hadiwa`:
```nginx
server {
    listen 80;
    server_name hadiwa.com www.hadiwa.com;
    root /var/www/hadiwa/frontend/build;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
server {
    listen 80;
    server_name api.hadiwa.com;
    location / { proxy_pass http://localhost:4000; }
}
```

### Enable Configurations
```bash
# Disable default nginx page
sudo rm /etc/nginx/sites-enabled/default

# Enable your projects
sudo ln -s /etc/nginx/sites-available/naoexpress /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/hadiwa /etc/nginx/sites-enabled/

# Test and Reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. SSL (HTTPS)
Run this once all domains are pointed to your IP:
```bash
sudo certbot --nginx -d naoexpress.com -d www.naoexpress.com -d api.naoexpress.com -d hadiwa.com -d www.hadiwa.com -d api.hadiwa.com
```

---

## 6. Automation (The "One Command")
Run this on the Droplet to update everything after pushing new code:

```bash
(cd /var/www/naoexpress/Backend && git pull && docker compose up -d --build) && \
(cd /var/www/naoexpress/Frontend && git pull && npm run build) && \
(cd /var/www/hadiwa/backend && git pull && docker compose up -d --build) && \
(cd /var/www/hadiwa/frontend && git pull && npm install --legacy-peer-deps && npm run build) && \
sudo systemctl reload nginx
```
