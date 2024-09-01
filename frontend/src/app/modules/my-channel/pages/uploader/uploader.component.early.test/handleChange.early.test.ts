// Unit tests for: handleChange

import { UploadComponent } from '../uploader.component';

// Mock class for ElementRef
class MockElementRef {
  nativeElement: { value: any } = { value: null };
}

describe('UploadComponent.handleChange() handleChange method', () => {
  let component: UploadComponent;
  let mockFileInput: MockElementRef;

  beforeEach(() => {
    mockFileInput = new MockElementRef();
    component = new UploadComponent();
    component.fileInput = mockFileInput as any;
  });

  describe('Happy Path', () => {
    it('should set fileUrl and videoFile when a valid file is uploaded', () => {
      // Arrange
      const mockFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      };

      // Act
      component.handleChange(mockEvent as any);

      // Assert
      expect(component.fileUrl).toBeTruthy();
      expect(component.videoFile).toBe(mockFile);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file input gracefully', () => {
      // Arrange
      const mockEvent = {
        target: {
          files: [],
        },
      };

      // Act
      component.handleChange(mockEvent as any);

      // Assert
      expect(component.fileUrl).toBeUndefined();
      expect(component.videoFile).toBeUndefined();
    });

    it('should handle null file input gracefully', () => {
      // Arrange
      const mockEvent = {
        target: {
          files: null,
        },
      };

      // Act
      component.handleChange(mockEvent as any);

      // Assert
      expect(component.fileUrl).toBeUndefined();
      expect(component.videoFile).toBeUndefined();
    });

    it('should handle undefined file input gracefully', () => {
      // Arrange
      const mockEvent = {
        target: {
          files: undefined,
        },
      };

      // Act
      component.handleChange(mockEvent as any);

      // Assert
      expect(component.fileUrl).toBeUndefined();
      expect(component.videoFile).toBeUndefined();
    });
  });
});

// End of unit tests for: handleChange
