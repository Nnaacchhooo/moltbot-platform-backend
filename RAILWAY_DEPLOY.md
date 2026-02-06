# 🚂 Deploy MoltBot Backend to Railway

## Quick Setup (5 minutos)

### 1. Conectá el Repo

1. Abrí https://railway.app/project/42215f45-dac6-4bce-b243-999c8f370170
2. Click en el servicio **"moltbot-platform-backend"** (ya creado)
3. Click **Settings** → **Connect Repo**
4. Seleccioná: `Nnaacchhooo/moltbot-platform-backend`
5. Branch: `master`

### 2. Variables de Entorno

Railway Settings → Variables → Add:

```
NODE_ENV=production
PORT=3001
```

**No se necesita más nada!** OpenClaw se configura automáticamente con el CLI.

### 3. Deploy!

Railway va a detectar automáticamente:
- Node.js project
- `npm install` para dependencies
- `npm run dev` para start (usando tsx watch)

El primer deploy toma ~2-3 minutos.

### 4. URL Pública

Cuando termine el deploy:
1. Railway Settings → Generate Domain
2. Te da una URL tipo: `moltbot-platform-backend-production.up.railway.app`

**Copiá esa URL!** La vas a necesitar para configurar el frontend.

---

## ✅ Checklist Post-Deploy

- [ ] Service deployed successfully
- [ ] Domain generated
- [ ] Health check works: `https://your-url.railway.app/health`
- [ ] WebSocket endpoint ready: `wss://your-url.railway.app`

---

## 🔧 Troubleshooting

**Deploy failed?**
- Check Logs en Railway dashboard
- Verify `package.json` tiene `"type": "module"`
- Verify Node.js version >= 18

**WebSocket no conecta?**
- Railway soporta WebSocket automáticamente
- Asegurate que el cliente usa `wss://` no `ws://`

---

## 📝 Próximo Paso

Una vez que tengas la URL del backend, actualizá el frontend:

```bash
cd moltbot-platform-frontend
echo "VITE_API_URL=https://tu-backend-url.railway.app" > .env.production
git add .env.production
git commit -m "Add production backend URL"
git push
vercel --prod
```

Done! 🎉
