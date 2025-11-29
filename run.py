#!/usr/bin/env python3
"""
Cross-platform script to run both Flask backend and Vite frontend.
Works on Windows, Linux, and macOS.
"""

import os
import sys
import subprocess
import platform
import time
import signal
from pathlib import Path

# Get the root directory of the project
ROOT_DIR = Path(__file__).parent.resolve()
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

# Check for both common venv directory names
if (ROOT_DIR / "venv").exists():
    VENV_DIR = ROOT_DIR / "venv"
elif (ROOT_DIR / ".venv").exists():
    VENV_DIR = ROOT_DIR / ".venv"
else:
    VENV_DIR = ROOT_DIR / ".venv"  # Default for error messages

# Determine the platform
IS_WINDOWS = platform.system() == "Windows"
IS_MAC = platform.system() == "Darwin"
IS_LINUX = platform.system() == "Linux"

# Process references for cleanup
backend_process = None
frontend_process = None


def get_venv_python():
    """Get the path to the Python executable in the virtual environment."""
    if IS_WINDOWS:
        return VENV_DIR / "Scripts" / "python.exe"
    else:
        return VENV_DIR / "bin" / "python"


def get_venv_activate():
    """Get the path to the activation script."""
    if IS_WINDOWS:
        return VENV_DIR / "Scripts" / "activate.bat"
    else:
        return VENV_DIR / "bin" / "activate"


def check_venv():
    """Check if virtual environment exists."""
    venv_python = get_venv_python()
    if not venv_python.exists():
        print("❌ ERROR: Virtual environment not found!")
        print(f"   Expected location: {VENV_DIR}")
        print("\n📝 Please create a virtual environment first:")
        print("   python -m venv .venv")
        print("\n   Then install dependencies:")
        if IS_WINDOWS:
            print("   .venv\\Scripts\\activate")
        else:
            print("   source .venv/bin/activate")
        print("   pip install -r requirements.txt")
        sys.exit(1)
    return venv_python


def cleanup(signum=None, frame=None):
    """Cleanup function to terminate both processes."""
    global backend_process, frontend_process
    
    print("\n\n🛑 Stopping servers...")
    
    if backend_process:
        print("   Stopping Flask backend...")
        try:
            if IS_WINDOWS:
                # On Windows, need to kill the process tree
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(backend_process.pid)],
                             stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
            else:
                backend_process.terminate()
                backend_process.wait(timeout=5)
        except Exception as e:
            print(f"   Warning: Could not stop backend gracefully: {e}")
    
    if frontend_process:
        print("   Stopping Vite dev server...")
        try:
            if IS_WINDOWS:
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(frontend_process.pid)],
                             stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
            else:
                frontend_process.terminate()
                frontend_process.wait(timeout=5)
        except Exception as e:
            print(f"   Warning: Could not stop frontend gracefully: {e}")
    
    print("✅ Cleanup complete")
    sys.exit(0)


def start_backend(venv_python):
    """Start the Flask backend server."""
    global backend_process
    
    print("🚀 Starting Flask backend...")
    
    # Construct the Flask command
    flask_cmd = [
        str(venv_python),
        "-m", "flask",
        "--app", "wsgi",
        "--debug",
        "run",
        "--host", "0.0.0.0",
        "--port", "5000"
    ]
    
    try:
        # Start Flask in the background
        if IS_WINDOWS:
            # On Windows, use CREATE_NEW_PROCESS_GROUP to allow Ctrl+C handling
            backend_process = subprocess.Popen(
                flask_cmd,
                cwd=BACKEND_DIR,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            backend_process = subprocess.Popen(
                flask_cmd,
                cwd=BACKEND_DIR
            )
        
        print(f"✅ Flask backend started (PID: {backend_process.pid})")
        print(f"   Backend URL: http://localhost:5000")
        
        # Give Flask a moment to start
        time.sleep(2)
        
        # Check if process is still running
        if backend_process.poll() is not None:
            print("❌ ERROR: Flask backend failed to start")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ ERROR: Failed to start Flask backend: {e}")
        sys.exit(1)


def start_frontend():
    """Start the Vite dev server."""
    global frontend_process
    
    print("\n🚀 Starting Vite dev server...")
    
    # Check if node_modules exists
    node_modules = FRONTEND_DIR / "node_modules"
    if not node_modules.exists():
        print("📦 Installing npm dependencies...")
        npm_cmd = ["npm.cmd" if IS_WINDOWS else "npm", "install"]
        try:
            subprocess.run(npm_cmd, cwd=FRONTEND_DIR, check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ ERROR: Failed to install npm dependencies: {e}")
            cleanup()
            sys.exit(1)
    
    # Start Vite dev server
    npm_cmd = ["npm.cmd" if IS_WINDOWS else "npm", "run", "dev", "--", "--host", "0.0.0.0"]
    
    try:
        frontend_process = subprocess.Popen(
            npm_cmd,
            cwd=FRONTEND_DIR
        )
        
        print(f"✅ Vite dev server started (PID: {frontend_process.pid})")
        print(f"   Frontend URL: http://localhost:5173")
        print("\n" + "="*60)
        print("🎉 Both servers are running!")
        print("="*60)
        print("\n💡 Press Ctrl+C to stop both servers\n")
        
    except Exception as e:
        print(f"❌ ERROR: Failed to start Vite dev server: {e}")
        cleanup()
        sys.exit(1)


def main():
    """Main function to orchestrate the startup."""
    print("\n" + "="*60)
    print("🔧 Starting Development Servers")
    print("="*60 + "\n")
    
    # Register signal handlers for cleanup
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)
    
    # Check virtual environment
    venv_python = check_venv()
    
    # Start backend
    start_backend(venv_python)
    
    # Start frontend
    start_frontend()
    
    # Keep the script running and monitor processes
    try:
        while True:
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("\n❌ Backend process stopped unexpectedly")
                cleanup()
                sys.exit(1)
            
            if frontend_process.poll() is not None:
                print("\n❌ Frontend process stopped unexpectedly")
                cleanup()
                sys.exit(1)
            
            time.sleep(1)
            
    except KeyboardInterrupt:
        cleanup()


if __name__ == "__main__":
    main()
