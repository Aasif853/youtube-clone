// Unit tests for: onVolumeSliderChange

import { VideoPlayerComponent } from '../video-player.component';

// Mock classes

class MockElementRef {
  nativeElement = {
    volume: 1,
    muted: false,
    paused: false,
    play: jest.fn(),
    pause: jest.fn(),
    requestFullscreen: jest.fn(),
    requestPictureInPicture: jest.fn(),
  };
}

class MockSubject {
  next = jest.fn();
  complete = jest.fn();
}

describe('VideoPlayerComponent.onVolumeSliderChange() onVolumeSliderChange method', () => {
  let component: VideoPlayerComponent;
  let mockElementRef: MockElementRef;
  let mockSubject: MockSubject;

  beforeEach(() => {
    mockElementRef = new MockElementRef() as any;
    mockSubject = new MockSubject() as any;
    component = new VideoPlayerComponent(mockElementRef as any);
    component.videoPlayer = mockElementRef as any;
  });

  describe('Happy Path', () => {
    it('should set the video volume to the value from the event', () => {
      // Arrange
      const event = { target: { value: 0.5 } };

      // Act
      component.onVolumeSliderChange(event);

      // Assert
      expect(component.videoElement.volume).toBe(0.5);
      expect(component.videoElement.muted).toBe(false);
    });

    it('should mute the video when volume is set to 0', () => {
      // Arrange
      const event = { target: { value: 0 } };

      // Act
      component.onVolumeSliderChange(event);

      // Assert
      expect(component.videoElement.volume).toBe(0);
      expect(component.videoElement.muted).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined event target value gracefully', () => {
      // Arrange
      const event = { target: {} };

      // Act
      component.onVolumeSliderChange(event);

      // Assert
      expect(component.videoElement.volume).toBe(1); // Default volume
      expect(component.videoElement.muted).toBe(false);
    });

    it('should handle null event gracefully', () => {
      // Arrange
      const event = null;

      // Act
      component.onVolumeSliderChange(event as any);

      // Assert
      expect(component.videoElement.volume).toBe(1); // Default volume
      expect(component.videoElement.muted).toBe(false);
    });

    it('should handle non-numeric volume values gracefully', () => {
      // Arrange
      const event = { target: { value: 'invalid' } };

      // Act
      component.onVolumeSliderChange(event as any);

      // Assert
      expect(component.videoElement.volume).toBe(1); // Default volume
      expect(component.videoElement.muted).toBe(false);
    });
  });
});

// End of unit tests for: onVolumeSliderChange
