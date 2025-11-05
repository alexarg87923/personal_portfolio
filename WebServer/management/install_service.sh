#!/bin/bash

# Script to install the personal_portfolio systemd service

# Service file location
SERVICE_FILE="personal_portfolio.service"
SYSTEMD_PATH="/etc/systemd/system/personal_portfolio.service"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Check if service file exists
if [ ! -f "$SCRIPT_DIR/$SERVICE_FILE" ]; then
    echo "Error: Service file not found at $SCRIPT_DIR/$SERVICE_FILE"
    exit 1
fi

# Create log directory
LOG_DIR="/home/alex/personal_portfolio/logs"
echo "Creating log directory at $LOG_DIR..."
mkdir -p "$LOG_DIR"
chown alex:alex "$LOG_DIR" 2>/dev/null || chown $SUDO_USER:$SUDO_USER "$LOG_DIR" 2>/dev/null || true
chmod 755 "$LOG_DIR"

# Create logrotate configuration for log file rotation
LOGROTATE_CONFIG="/etc/logrotate.d/personal_portfolio"
echo "Creating logrotate configuration..."
cat > "$LOGROTATE_CONFIG" << 'EOF'
/home/alex/personal_portfolio/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 alex alex
    sharedscripts
    postrotate
        systemctl reload personal_portfolio > /dev/null 2>&1 || true
    endscript
}
EOF

# Ensure systemd journal persistence
JOURNAL_DIR="/var/log/journal"
if [ ! -d "$JOURNAL_DIR" ]; then
    echo "Creating persistent journal directory..."
    mkdir -p "$JOURNAL_DIR"
    chown root:systemd-journal "$JOURNAL_DIR"
    chmod 2755 "$JOURNAL_DIR"
    systemctl restart systemd-journald 2>/dev/null || true
fi

# Copy service file to systemd directory
echo "Copying service file to $SYSTEMD_PATH..."
cp "$SCRIPT_DIR/$SERVICE_FILE" "$SYSTEMD_PATH"

# Reload systemd daemon
echo "Reloading systemd daemon..."
systemctl daemon-reload

# Enable the service
echo "Enabling personal_portfolio service..."
systemctl enable personal_portfolio

# Start the service
echo "Starting personal_portfolio service..."
systemctl start personal_portfolio

# Check service status
echo ""
echo "Service status:"
systemctl status personal_portfolio --no-pager

echo ""
echo "Installation complete!"
echo ""
echo "Logs:"
echo "  - File logs: $LOG_DIR/portfolio.log and $LOG_DIR/portfolio_error.log"
echo "  - Journal logs: journalctl -u personal_portfolio -f"
echo ""
echo "Log rotation:"
echo "  - Logs rotate daily and keep 30 days"
echo "  - Configuration: $LOGROTATE_CONFIG"
echo ""
echo "Service management:"
echo "  - Status: systemctl status personal_portfolio"
echo "  - Stop: systemctl stop personal_portfolio"
echo "  - Restart: systemctl restart personal_portfolio"
echo "  - View logs: tail -f $LOG_DIR/portfolio.log"

