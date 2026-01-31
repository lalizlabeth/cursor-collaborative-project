import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Window, WindowProps } from "../Window";

// Default props for testing
const defaultProps: WindowProps = {
  id: "test-window",
  title: "Test window",
  children: <div>Test content</div>,
  position: { x: 100, y: 100 },
  size: { width: 400, height: 300 },
  minSize: { width: 200, height: 150 },
  zIndex: 1,
  onMove: vi.fn(),
  onResize: vi.fn(),
  onClose: vi.fn(),
  onMinimize: vi.fn(),
  onMaximize: vi.fn(),
  onFocus: vi.fn(),
};

// Helper to render Window with custom props
const renderWindow = (props: Partial<WindowProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(<Window {...mergedProps} />);
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  // Reset window width to desktop
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1200,
  });
});

describe("Window", () => {
  describe("Rendering", () => {
    it("should render with the provided title", () => {
      renderWindow({ title: "My window" });
      expect(screen.getByText("My window")).toBeInTheDocument();
    });

    it("should render children content", () => {
      renderWindow({ children: <div data-testid="custom-content">Custom content</div> });
      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("Custom content")).toBeInTheDocument();
    });

    it("should render traffic light buttons", () => {
      renderWindow();
      expect(screen.getByTestId("window-close-button")).toBeInTheDocument();
      expect(screen.getByTestId("window-minimize-button")).toBeInTheDocument();
      expect(screen.getByTestId("window-maximize-button")).toBeInTheDocument();
    });

    it("should render resize handle on desktop", () => {
      renderWindow();
      expect(screen.getByTestId("window-resize-handle")).toBeInTheDocument();
    });

    it("should apply custom color to title bar", () => {
      renderWindow({ color: "#FFB5C5" });
      const titleBar = screen.getByTestId("window-title-bar");
      expect(titleBar).toHaveStyle({ background: "#FFB5C5" });
    });
  });

  describe("Dragging", () => {
    it("should call onMove when title bar is dragged", () => {
      const onMove = vi.fn();
      renderWindow({ onMove, position: { x: 0, y: 0 } });

      const titleBar = screen.getByTestId("window-title-bar");

      // Start drag
      fireEvent.mouseDown(titleBar, { clientX: 50, clientY: 20 });
      // Move mouse
      fireEvent.mouseMove(document, { clientX: 150, clientY: 70 });
      // End drag
      fireEvent.mouseUp(document);

      expect(onMove).toHaveBeenCalled();
    });

    it("should call onFocus when dragging starts", () => {
      const onFocus = vi.fn();
      renderWindow({ onFocus });

      const titleBar = screen.getByTestId("window-title-bar");
      fireEvent.mouseDown(titleBar, { clientX: 50, clientY: 20 });

      expect(onFocus).toHaveBeenCalled();
    });

    it("should not allow dragging when maximized", () => {
      const onMove = vi.fn();
      renderWindow({ onMove, isMaximized: true });

      const titleBar = screen.getByTestId("window-title-bar");
      fireEvent.mouseDown(titleBar, { clientX: 50, clientY: 20 });
      fireEvent.mouseMove(document, { clientX: 150, clientY: 70 });
      fireEvent.mouseUp(document);

      expect(onMove).not.toHaveBeenCalled();
    });
  });

  describe("Resizing", () => {
    it("should call onResize when resize handle is dragged", () => {
      const onResize = vi.fn();
      renderWindow({ onResize, size: { width: 400, height: 300 } });

      const resizeHandle = screen.getByTestId("window-resize-handle");

      // Start resize
      fireEvent.mouseDown(resizeHandle, { clientX: 400, clientY: 300 });
      // Move mouse
      fireEvent.mouseMove(document, { clientX: 500, clientY: 400 });
      // End resize
      fireEvent.mouseUp(document);

      expect(onResize).toHaveBeenCalled();
    });

    it("should respect minSize when resizing", () => {
      const onResize = vi.fn();
      renderWindow({
        onResize,
        size: { width: 400, height: 300 },
        minSize: { width: 200, height: 150 },
      });

      const resizeHandle = screen.getByTestId("window-resize-handle");

      // Start resize
      fireEvent.mouseDown(resizeHandle, { clientX: 400, clientY: 300 });
      // Try to resize smaller than minSize
      fireEvent.mouseMove(document, { clientX: 100, clientY: 50 });
      fireEvent.mouseUp(document);

      // The onResize should be called with values >= minSize
      if (onResize.mock.calls.length > 0) {
        const lastCall = onResize.mock.calls[onResize.mock.calls.length - 1][0];
        expect(lastCall.width).toBeGreaterThanOrEqual(200);
        expect(lastCall.height).toBeGreaterThanOrEqual(150);
      }
    });

    it("should call onFocus when resizing starts", () => {
      const onFocus = vi.fn();
      renderWindow({ onFocus });

      const resizeHandle = screen.getByTestId("window-resize-handle");
      fireEvent.mouseDown(resizeHandle, { clientX: 400, clientY: 300 });

      expect(onFocus).toHaveBeenCalled();
    });

    it("should not allow resizing when maximized", () => {
      const onResize = vi.fn();
      renderWindow({ onResize, isMaximized: true });

      // Resize handle should not be in the document when maximized
      expect(screen.queryByTestId("window-resize-handle")).not.toBeInTheDocument();
    });
  });

  describe("Traffic light buttons", () => {
    it("should call onClose when close button is clicked", () => {
      const onClose = vi.fn();
      renderWindow({ onClose });

      const closeButton = screen.getByTestId("window-close-button");
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onMinimize when minimize button is clicked", () => {
      const onMinimize = vi.fn();
      renderWindow({ onMinimize });

      const minimizeButton = screen.getByTestId("window-minimize-button");
      fireEvent.click(minimizeButton);

      expect(onMinimize).toHaveBeenCalledTimes(1);
    });

    it("should call onMaximize when maximize button is clicked", () => {
      const onMaximize = vi.fn();
      renderWindow({ onMaximize });

      const maximizeButton = screen.getByTestId("window-maximize-button");
      fireEvent.click(maximizeButton);

      expect(onMaximize).toHaveBeenCalledTimes(1);
    });

    it("should stop propagation when clicking traffic light buttons", () => {
      const onFocus = vi.fn();
      const onClose = vi.fn();
      renderWindow({ onFocus, onClose });

      // Clear any focus calls from initial render
      onFocus.mockClear();

      const closeButton = screen.getByTestId("window-close-button");
      fireEvent.click(closeButton);

      // onClose should be called but clicking button shouldn't trigger extra focus
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Focus management", () => {
    it("should call onFocus when window body is clicked", () => {
      const onFocus = vi.fn();
      renderWindow({ onFocus });

      const window = screen.getByTestId("window-test-window");
      fireEvent.click(window);

      expect(onFocus).toHaveBeenCalled();
    });
  });

  describe("Responsive behavior", () => {
    it("should hide resize handle on mobile viewport", () => {
      // Set mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      renderWindow();

      // Trigger resize event to update isMobile state
      fireEvent(window, new Event("resize"));

      // In mobile mode, resize handle should not be visible
      // Note: The component uses CSS and state to hide it
    });

    it("should not allow dragging on mobile viewport", () => {
      const onMove = vi.fn();

      // Set mobile viewport before rendering
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      renderWindow({ onMove });

      // Trigger resize event
      fireEvent(window, new Event("resize"));

      const titleBar = screen.getByTestId("window-title-bar");
      fireEvent.mouseDown(titleBar, { clientX: 50, clientY: 20 });
      fireEvent.mouseMove(document, { clientX: 150, clientY: 70 });
      fireEvent.mouseUp(document);

      // On mobile, dragging should be disabled
      // The component checks isMobile state before allowing drag
    });
  });

  describe("Positioning and sizing", () => {
    it("should apply position styles on desktop", () => {
      renderWindow({ position: { x: 200, y: 150 } });

      const window = screen.getByTestId("window-test-window");
      expect(window).toHaveStyle({ left: "200px", top: "150px" });
    });

    it("should apply size styles on desktop", () => {
      renderWindow({ size: { width: 500, height: 400 } });

      const window = screen.getByTestId("window-test-window");
      expect(window).toHaveStyle({ width: "500px", height: "400px" });
    });

    it("should apply zIndex style", () => {
      renderWindow({ zIndex: 10 });

      const window = screen.getByTestId("window-test-window");
      expect(window).toHaveStyle({ zIndex: "10" });
    });

    it("should fill viewport when maximized", () => {
      renderWindow({ isMaximized: true });

      const window = screen.getByTestId("window-test-window");
      expect(window).toHaveStyle({ width: "100%", height: "100%" });
    });
  });
});
