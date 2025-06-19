#!/usr/bin/env python3
"""
Simple HTTP Server for Tic Tac Toe Game
Run this server to host your Tic Tac Toe game locally.
"""

import http.server
import socketserver
import os
import webbrowser
import sys
from pathlib import Path

class TicTacToeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with proper MIME types"""
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Enhanced MIME type detection"""
        mime_type, _ = super().guess_type(path)
        
        # Ensure proper MIME types
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        
        return mime_type
    
    def log_message(self, format, *args):
        """Custom logging with colors"""
        message = format % args
        timestamp = self.log_date_time_string()
        print(f"🌐 [{timestamp}] {message}")

def find_free_port(start_port=8000, max_attempts=10):
    """Find a free port starting from start_port"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"Could not find a free port in range {start_port}-{start_port + max_attempts}")

def main():
    """Main server function"""
    # Change to the directory containing the game files
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check if required files exist
    required_files = ['index.html', 'style.css', 'script.js']
    missing_files = [f for f in required_files if not Path(f).exists()]
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        print("Please ensure all game files are in the same directory as this server.")
        sys.exit(1)
    
    # Find a free port
    try:
        port = find_free_port()
    except RuntimeError as e:
        print(f"❌ {e}")
        sys.exit(1)
    
    # Create and start the server
    handler = TicTacToeHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            server_url = f"http://localhost:{port}"
            
            print("🎮 Tic Tac Toe Server Starting...")
            print("=" * 50)
            print(f"🌐 Server running at: {server_url}")
            print(f"📁 Serving files from: {script_dir}")
            print("🎯 Game features:")
            print("   • Interactive 3x3 game board")
            print("   • Score tracking")
            print("   • Responsive design")
            print("   • Keyboard support (1-9 keys)")
            print("   • Sound effects")
            print("=" * 50)
            print("✅ Server ready! Opening game in browser...")
            print("💡 Press Ctrl+C to stop the server")
            print()
            
            # Try to open the browser
            try:
                webbrowser.open(server_url)
                print("🚀 Game opened in your default browser!")
            except Exception as e:
                print(f"⚠️  Could not open browser automatically: {e}")
                print(f"   Please manually open: {server_url}")
            
            print()
            print("Server logs:")
            print("-" * 30)
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n" + "=" * 50)
        print("🛑 Server stopped by user")
        print("👋 Thanks for playing Tic Tac Toe!")
        print("=" * 50)
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 