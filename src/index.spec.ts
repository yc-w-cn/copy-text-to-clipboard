import { copyText } from "./";

// Mock input
const mockInput = {
  value: "",
  select: jest.fn(),
};

describe("copyText", () => {
  beforeEach(() => {
    // Mock document
    const mockDocument = {
      createElement: jest.fn(() => mockInput),
      execCommand: jest.fn(),
      addEventListener: jest.fn(),
    };
    Object.assign(global.document, mockDocument);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });
  afterEach(() => {
    // Reset mock functions
    jest.resetAllMocks();
  });

  test("should copy text using clipboard.writeText when navigator.clipboard is available", () => {
    // Set navigator
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    // Examples
    const text = "example text";

    copyText(text);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
  });

  test("should copy text using copy-paste method when navigator.clipboard is not available", () => {
    // Set navigator
    Object.assign(global.navigator, {
      clipboard: null,
    });

    // Examples
    const text = "example text";

    copyText(text);

    expect(document.createElement).toHaveBeenCalledWith("input");
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(mockInput.select).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});
