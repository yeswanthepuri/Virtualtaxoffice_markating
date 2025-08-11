# 3-Layer Marketing Site

## Architecture
- **Frontend**: Angular with animations (Port 4200)
- **Backend**: .NET 8 Web API with PostgreSQL (Port 3000)
- **Database**: PostgreSQL (Port 5432)

## Quick Start
```bash
docker-compose up --build
```

## Access
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- Database: localhost:5432

## API Endpoints
- GET /api/users - Get all users
- POST /api/users - Create user