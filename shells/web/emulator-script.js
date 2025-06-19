class MobileEmulator {
    constructor() {
        this.deviceSelect = document.getElementById('device-select');
        this.deviceContainer = document.getElementById('device-container');
        this.currentDevice = 'phone-portrait';
        
        this.init();
    }

    init() {
        // Update iframe sources with URL parameters before setting up other functionality
        this.updateIframeSources();

        // Set up event listeners
        this.deviceSelect.addEventListener('change', (e) => {
            this.switchDevice(e.target.value);
        });

        // Handle window resize for responsive scaling
        window.addEventListener('resize', () => {
            this.updateScale();
        });

        // Initial scale calculation
        this.updateScale();

        // Set initial device
        this.switchDevice(this.currentDevice);
    }

    /**
     * Extract URL parameters from the emulator page and pass them to the iframes
     */
    updateIframeSources() {
        // Get current URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Build query string from parameters
        const queryString = urlParams.toString();
        
        // Update iframe sources to include the parameters
        const baseUrl = 'index.html';
        const iframeSrc = queryString ? `${baseUrl}?${queryString}` : baseUrl;
        
        // Update both iframes
        const phoneIframe = document.getElementById('app-iframe');
        const tabletIframe = document.getElementById('app-iframe-tablet');
        
        if (phoneIframe) {
            phoneIframe.src = iframeSrc;
        }
        
        if (tabletIframe) {
            tabletIframe.src = iframeSrc;
        }
        
        // Log for debugging
        if (queryString) {
            console.log('Emulator: Passing URL parameters to iframes:', queryString);
        }
    }

    switchDevice(deviceType) {
        const currentFrame = document.getElementById(this.currentDevice);
        const newFrame = document.getElementById(deviceType);

        if (!newFrame || deviceType === this.currentDevice) {
            return;
        }

        // Add switching animation classes
        if (currentFrame) {
            currentFrame.classList.add('switching-out');
        }

        // Wait for animation, then switch
        setTimeout(() => {
            // Hide current device
            if (currentFrame) {
                currentFrame.style.display = 'none';
                currentFrame.classList.remove('switching-out');
            }

            // Show new device
            newFrame.style.display = 'block';
            newFrame.classList.add('switching-in');

            // Update current device
            this.currentDevice = deviceType;

            // Remove animation class after animation completes
            setTimeout(() => {
                newFrame.classList.remove('switching-in');
            }, 400);

            // Update scale for new device
            this.updateScale();

        }, 200);
    }

    updateScale() {
        const container = this.deviceContainer;
        const frame = document.getElementById(this.currentDevice);
        
        if (!frame) return;

        // Get container and frame dimensions
        const containerRect = container.getBoundingClientRect();
        const frameRect = frame.getBoundingClientRect();
        
        // Calculate available space (with some padding)
        const availableWidth = window.innerWidth - 100; // 50px padding on each side
        const availableHeight = window.innerHeight - 200; // Space for header and instructions
        
        // Get frame's natural dimensions
        const frameWidth = this.getDeviceWidth(this.currentDevice);
        const frameHeight = this.getDeviceHeight(this.currentDevice);
        
        // Calculate scale factors
        const scaleX = availableWidth / frameWidth;
        const scaleY = availableHeight / frameHeight;
        
        // Use the smaller scale factor to ensure the device fits
        let scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%
        
        // Set minimum scale to ensure usability
        scale = Math.max(scale, 0.3);
        
        // Apply scale with smooth transition
        container.style.transform = `scale(${scale})`;
        
        // Update container height to prevent layout issues
        const scaledHeight = frameHeight * scale;
        container.style.minHeight = `${scaledHeight}px`;
    }

    getDeviceWidth(deviceType) {
        switch (deviceType) {
            case 'phone-portrait':
                return 420; // 400px screen + 20px bezel
            case 'tablet-landscape':
                return 1064; // 1024px screen + 40px bezel
            default:
                return 420;
        }
    }

    getDeviceHeight(deviceType) {
        switch (deviceType) {
            case 'phone-portrait':
                return 760; // 740px screen + 20px bezel
            case 'tablet-landscape':
                return 808; // 768px screen + 40px bezel
            default:
                return 760;
        }
    }

    // Method to refresh iframe content (useful for development)
    refreshContent() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.src = iframe.src;
        });
    }

    // Method to get current device info
    getCurrentDeviceInfo() {
        return {
            type: this.currentDevice,
            width: this.getDeviceWidth(this.currentDevice),
            height: this.getDeviceHeight(this.currentDevice),
            screenWidth: this.currentDevice === 'phone-portrait' ? 400 : 1024,
            screenHeight: this.currentDevice === 'phone-portrait' ? 740 : 768
        };
    }
}

// Initialize emulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const emulator = new MobileEmulator();
    
    // Make emulator globally accessible for debugging
    window.mobileEmulator = emulator;
        
    // Add touch/gesture support for mobile users of the emulator
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartY || !touchStartX) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        
        const diffY = touchStartY - touchEndY;
        const diffX = touchStartX - touchEndX;
        
        // Swipe left/right to switch devices
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const currentDevice = emulator.currentDevice;
            if (diffX > 0 && currentDevice === 'phone-portrait') {
                // Swipe left: phone to tablet
                document.getElementById('device-select').value = 'tablet-landscape';
                emulator.switchDevice('tablet-landscape');
            } else if (diffX < 0 && currentDevice === 'tablet-landscape') {
                // Swipe right: tablet to phone
                document.getElementById('device-select').value = 'phone-portrait';
                emulator.switchDevice('phone-portrait');
            }
        }
        
        touchStartY = 0;
        touchStartX = 0;
    });
});

// Utility function to simulate different network conditions (for future enhancement)
function simulateNetworkCondition(condition) {
    // This could be enhanced to throttle iframe loading
    console.log(`Simulating ${condition} network condition`);
}

// Utility function to capture screenshot (for future enhancement)
function captureScreenshot() {
    // This could be enhanced to capture the iframe content
    console.log('Screenshot feature - would capture current device view');
}
