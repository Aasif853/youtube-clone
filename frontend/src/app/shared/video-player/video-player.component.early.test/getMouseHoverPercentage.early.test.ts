// Unit tests for: getMouseHoverPercentage

import { VideoPlayerComponent } from '../video-player.component';

// Mock classes
class MockHls {
  public levels = [{ height: 720 }, { height: 1080 }];
  public on = jest.fn();
  public attachMedia = jest.fn();
  public loadSource = jest.fn();
}

class MockElementRef {
  public nativeElement = {
    getBoundingClientRect: jest.fn().mockReturnValue({
      x: 0,
      width: 100,
    }),
  };
}

class MockSubject {
  public next = jest.fn();
  public complete = jest.fn();
}

describe('VideoPlayerComponent.getMouseHoverPercentage() getMouseHoverPercentage method', () => {
  let component: VideoPlayerComponent;
  let mockElementRef: MockElementRef;
  let mockHls: MockHls;
  let mockSubject: MockSubject;

  beforeEach(() => {
    mockElementRef = new MockElementRef() as any;
    mockHls = new MockHls() as any;
    mockSubject = new MockSubject() as any;

    component = new VideoPlayerComponent(mockElementRef as any);
    component.timeLineContainer = mockElementRef as any;
  });

  describe('Happy Path', () => {
    it('should return correct percentage when mouse is at the start of the timeline', () => {
      // Arrange
      const event = { x: 0 } as MouseEvent;

      // Act
      const percentage = component.getMouseHoverPercentage(event);

      // Assert
      expect(percentage).toBe(0);
    });

    it('should return correct percentage when mouse is at the end of the timeline', () => {
      // Arrange
      const event = { x: 100 } as MouseEvent;

      // Act
      const percentage = component.getMouseHoverPercentage(event);

      // Assert
      expect(percentage).toBe(1);
    });

    it('should return correct percentage when mouse is in the middle of the timeline', () => {
      // Arrange
      const event = { x: 50 } as MouseEvent;

      // Act
      const percentage = component.getMouseHoverPercentage(event);

      // Assert
      expect(percentage).toBe(0.5);
    });
  });

  describe('Edge Cases', () => {
    it('should return 0 when mouse is before the start of the timeline', () => {
      // Arrange
      const event = { x: -10 } as MouseEvent;

      // Act
      const percentage = component.getMouseHoverPercentage(event);

      // Assert
      expect(percentage).toBe(0);
    });

    it('should return 1 when mouse is beyond the end of the timeline', () => {
      // Arrange
      const event = { x: 110 } as MouseEvent;

      // Act
      const percentage = component.getMouseHoverPercentage(event);

      // Assert
      expect(percentage).toBe(1);
    });

    it('should handle fractional positions correctly', () => {
      // Arrange
      const event = { x: 25 } as MouseEvent;

      // Act
      const percentage = component.getMouseHoverPercentage(event);

      // Assert
      expect(percentage).toBe(0.25);
    });
  });
});

// End of unit tests for: getMouseHoverPercentage
