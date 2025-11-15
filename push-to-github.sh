#!/bin/bash

# Replace YOUR_USERNAME with your actual GitHub username
read -p "Enter your GitHub username: " username

# Add remote origin
git remote add origin https://github.com/$username/stanley-moore-inspired.git

# Push to GitHub
git push -u origin main

echo "✅ Project pushed to GitHub successfully!"
echo "🌐 Repository URL: https://github.com/$username/stanley-moore-inspired"