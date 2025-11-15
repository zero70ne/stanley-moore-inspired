#!/bin/bash

set -euo pipefail  # Exit on any error, undefined variables, pipe failures

# Error handling function
error_exit() {
    local line_no="${1:-unknown}"
    local error_msg="${2:-Unknown error}"
    echo "Error on line ${line_no}: ${error_msg}" >&2
    cleanup
    exit 1
}

# Cleanup function
cleanup() {
    if [[ -n "${CLEANUP_NEEDED:-}" ]]; then
        echo "Cleaning up..." >&2
        # Add any cleanup operations here if needed
    fi
}

# Trap errors and signals
trap 'error_exit $LINENO "Command failed"' ERR
trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

# Validate environment
if ! command -v npm >/dev/null 2>&1; then
    error_exit "${LINENO}" "npm is not installed or not in PATH"
fi

if [[ ! -f "package.json" ]]; then
    error_exit "${LINENO}" "package.json not found in current directory"
fi

if [[ ! -r "package.json" ]]; then
    error_exit "${LINENO}" "package.json is not readable"
fi

echo "Fixing frontend dependencies..."

# Remove node_modules and package-lock.json
if [[ -d "node_modules" ]]; then
    echo "Removing node_modules..."
    CLEANUP_NEEDED=1
    rm -rf node_modules || error_exit "${LINENO}" "Failed to remove node_modules directory"
fi

if [[ -f "package-lock.json" ]]; then
    echo "Removing package-lock.json..."
    rm -f package-lock.json || error_exit "${LINENO}" "Failed to remove package-lock.json"
fi

# Install dependencies with correct versions
echo "Installing dependencies..."
CLEANUP_NEEDED=1
if npm install; then
    unset CLEANUP_NEEDED 2>/dev/null || true
    echo "Dependencies fixed! You can now run 'npm start' to start the development server."
else
    error_exit "${LINENO}" "Failed to install dependencies. Please check your internet connection and try again."
fi