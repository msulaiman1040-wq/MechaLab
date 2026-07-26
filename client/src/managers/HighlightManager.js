class HighlightManagerClass {
    constructor() {
        this.highlightedPartId = null;
        this.listeners = new Set();
    }

    // Get the currently highlighted part ID
    getHighlightedPart() {
        return this.highlightedPartId;
    }

    // Set a part to be highlighted
    highlight(partId) {
        this.highlightedPartId = partId;
        this.notifyListeners();
    }

    // Clear any active highlight
    clear() {
        this.highlightedPartId = null;
        this.notifyListeners();
    }

    // Subscribe components (like Vehicle.jsx) to highlight changes
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.highlightedPartId));
    }
}

const HighlightManager = new HighlightManagerClass();
export default HighlightManager;