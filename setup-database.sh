#!/bin/bash

echo "🔥 Deploying Firestore Security Rules..."
firebase deploy --only firestore:rules

echo "⏳ Waiting for rules to propagate (30 seconds)..."
sleep 30

echo "🌱 Seeding database..."
curl -X POST http://localhost:8081/data-seeder/seed

echo "✅ Setup complete!"
echo "📊 Visit http://localhost:8081/db-test to verify setup"
