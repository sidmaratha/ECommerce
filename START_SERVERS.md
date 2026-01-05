# How to Start the Servers

## Quick Start (Windows)

Double-click `start_servers.bat` to start both servers in separate windows.

## Manual Start

### Option 1: Separate Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```powershell
cd C:\Users\Sid\OneDrive\Desktop\cursor\backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\Sid\OneDrive\Desktop\cursor\frontend
npm run dev
```

### Option 2: PowerShell (Background)

**Backend:**
```powershell
cd C:\Users\Sid\OneDrive\Desktop\cursor\backend
Start-Process python -ArgumentList "manage.py","runserver"
```

**Frontend:**
```powershell
cd C:\Users\Sid\OneDrive\Desktop\cursor\frontend
Start-Process npm -ArgumentList "run","dev"
```

## Verify Servers Are Running

### Backend (Django)
- Open: http://localhost:8000/admin/
- Should show Django admin login page
- If you see a login page, backend is working!

### Frontend (React)
- Open: http://localhost:3000
- Should show the e-commerce homepage
- If you see the store, frontend is working!

## Troubleshooting

### "This site can't be reached"

**Check if servers are running:**
1. Look for terminal windows with Django/React output
2. Check if ports are in use:
   ```powershell
   netstat -ano | findstr ":8000"  # Backend
   netstat -ano | findstr ":3000"  # Frontend
   ```

**Common Issues:**

1. **Port already in use:**
   - Kill the process using the port
   - Or change the port in settings

2. **Backend not starting:**
   - Check for Python errors in terminal
   - Verify database migrations: `python manage.py migrate`
   - Check if virtual environment is activated

3. **Frontend not starting:**
   - Check for Node.js errors in terminal
   - Verify dependencies: `npm install`
   - Check if Node.js is in PATH

4. **Database errors:**
   - Run migrations: `python manage.py migrate`
   - Check database file exists: `backend/db.sqlite3`

### Stop Servers

Press `Ctrl+C` in each terminal window, or close the terminal windows.

## Access URLs

Once servers are running:

- **Frontend Store:** http://localhost:3000
- **Django Admin:** http://localhost:8000/admin/
- **API Docs:** http://localhost:8000/api/docs/
- **API Root:** http://localhost:8000/api/

## Need Help?

If servers still won't start:
1. Check terminal windows for error messages
2. Verify all dependencies are installed
3. Make sure ports 8000 and 3000 are not blocked by firewall
4. Try restarting your computer if ports seem stuck

