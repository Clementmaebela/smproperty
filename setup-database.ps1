# Database Setup Script for Windows
Write-Host "🔥 Deploying Firestore Security Rules..." -ForegroundColor Green
firebase deploy --only firestore:rules

Write-Host "⏳ Waiting for rules to propagate (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host "🌱 Database setup complete!" -ForegroundColor Green
Write-Host "📊 Visit http://localhost:8081/db-test to verify setup" -ForegroundColor Cyan
Write-Host "🌱 Visit http://localhost:8081/data-seeder to seed database" -ForegroundColor Cyan
