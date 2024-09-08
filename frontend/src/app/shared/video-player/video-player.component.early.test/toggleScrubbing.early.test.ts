// Unit tests for: toggleScrubbing

import { VideoPlayerComponent } from '../video-player.component';

describe('VideoPlayerComponent.toggleScrubbing() toggleScrubbing method', () => {
  let component: VideoPlayerComponent;
  let mockElementRef: MockElementRef;
  let mockHls: MockHls;
  let mockSubject: MockSubject;
  let mockDocument: Document;

  beforeEach(() => {
    mockElementRef = new MockElementRef() as any;
    mockHls = new MockHls() as any;
    mockSubject = new MockSubject() as any;
    mockDocument = document;

    component = new VideoPlayerComponent(mockElementRef as any);
    component.videoPlayer = mockElementRef as any;
    component.timeLineContainer = mockElementRef as any;
    component['_document'] = mockDocument;
  });

  describe('Happy Path', () => {
    it('should start scrubbing when mouse button is pressed', () => {
      // Arrange
      const mockEvent = {
        buttons: 1,
        x: 50,
      } as MouseEvent;
      const mockRect = {
        x: 0,
        width: 100,
      };
      jest
        .spyOn(mockElementRef.nativeElement, 'getBoundingClientRect')
        .mockReturnValue(mockRect as any);

      // Act
      component.toggleScrubbing(mockEvent);

      // Assert
      expect(component['isScrubbing']).toBe(true);
      expect(component['wasPlaying']).toBe(false);
      expect(component.videoElement.pause).toHaveBeenCalled();
    });

    it('should stop scrubbing and resume playing if video was playing', () => {
      // Arrange
      component['wasPlaying'] = false;
      const mockEvent = {
        buttons: 0,
        x: 50,
      } as MouseEvent;
      const mockRect = {
        x: 0,
        width: 100,
      };
      jest
        .spyOn(mockElementRef.nativeElement, 'getBoundingClientRect')
        .mockReturnValue(mockRect as any);
      component.videoElement.duration = 100;

      // Act
      component.toggleScrubbing(mockEvent);

      // Assert
      expect(component['isScrubbing']).toBe(false);
      expect(component.videoElement.currentTime).toBe(50);
      expect(component.videoElement.play).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle mouse event with no buttons pressed gracefully', () => {
      // Arrange
      const mockEvent = {
        buttons: 0,
        x: 50,
      } as MouseEvent;
      const mockRect = {
        x: 0,
        width: 100,
      };
      jest
        .spyOn(mockElementRef.nativeElement, 'getBoundingClientRect')
        .mockReturnValue(mockRect as any);

      // Act
      component.toggleScrubbing(mockEvent);

      // Assert
      expect(component['isScrubbing']).toBe(false);
      expect(component.videoElement.currentTime).toBe(50);
    });

    it('should not change currentTime if event x is out of bounds', () => {
      // Arrange
      const mockEvent = {
        buttons: 0,
        x: 150,
      } as MouseEvent;
      const mockRect = {
        x: 0,
        width: 100,
      };
      jest
        .spyOn(mockElementRef.nativeElement, 'getBoundingClientRect')
        .mockReturnValue(mockRect as any);
      component.videoElement.duration = 100;

      // Act
      component.toggleScrubbing(mockEvent);

      // Assert
      expect(component.videoElement.currentTime).toBe(100);
    });
  });
});

// Mock classes
class MockElementRef {
  nativeElement = {
    getBoundingClientRect: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
    duration: 0,
    currentTime: 0,
  };
}

class MockHls {
  // Mock Hls properties and methods as needed
}

class MockSubject {
  // Mock Subject properties and methods as needed
}

// End of unit tests for: toggleScrubbing
