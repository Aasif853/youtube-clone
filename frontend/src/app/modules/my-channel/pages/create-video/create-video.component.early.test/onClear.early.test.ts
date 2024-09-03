// Unit tests for: onClear

import { ChannelService } from '../../../../../service/channel.service';

import { AppSettingService } from '../../../../../service/appSetting.service';

import { CreateVideoComponent } from '../create-video.component';

// Mock classes
class MockUploadComponent {
  handleRemovesFile = jest.fn();
  handleRemovesThumbnail = jest.fn();
}

class MockFormGroup {
  reset = jest.fn();
}

describe('CreateVideoComponent.onClear() onClear method', () => {
  let component: CreateVideoComponent;
  let mockUploadComponent: MockUploadComponent;
  let mockFormGroup: MockFormGroup;
  let mockAppSettingService: jest.Mocked<AppSettingService>;
  let mockChannelService: jest.Mocked<ChannelService>;

  beforeEach(() => {
    mockUploadComponent = new MockUploadComponent() as any;
    mockFormGroup = new MockFormGroup() as any;
    mockAppSettingService = {
      openSnackBar: jest.fn(),
    } as any;
    mockChannelService = {} as any;

    component = new CreateVideoComponent(
      mockChannelService,
      mockAppSettingService,
    ) as any;
    component.uploadComponent = mockUploadComponent as any;
    component.videoForm = mockFormGroup as any;
  });

  describe('Happy Path', () => {
    it('should reset the form and call handleRemovesFile and handleRemovesThumbnail on the upload component', () => {
      // Act
      component.onClear();

      // Assert
      expect(mockFormGroup.reset).toHaveBeenCalled();
      expect(mockUploadComponent.handleRemovesFile).toHaveBeenCalled();
      expect(mockUploadComponent.handleRemovesThumbnail).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle the case where form reset throws an error gracefully', () => {
      // Arrange
      mockFormGroup.reset.mockImplementation(() => {
        throw new Error('Reset error');
      });

      // Act & Assert
      expect(() => component.onClear()).toThrow('Reset error');
      expect(mockUploadComponent.handleRemovesFile).not.toHaveBeenCalled();
      expect(mockUploadComponent.handleRemovesThumbnail).not.toHaveBeenCalled();
    });

    it('should handle the case where handleRemovesFile throws an error gracefully', () => {
      // Arrange
      mockUploadComponent.handleRemovesFile.mockImplementation(() => {
        throw new Error('File removal error');
      });

      // Act & Assert
      expect(() => component.onClear()).toThrow('File removal error');
      expect(mockFormGroup.reset).toHaveBeenCalled();
      expect(mockUploadComponent.handleRemovesThumbnail).not.toHaveBeenCalled();
    });

    it('should handle the case where handleRemovesThumbnail throws an error gracefully', () => {
      // Arrange
      mockUploadComponent.handleRemovesThumbnail.mockImplementation(() => {
        throw new Error('Thumbnail removal error');
      });

      // Act & Assert
      expect(() => component.onClear()).toThrow('Thumbnail removal error');
      expect(mockFormGroup.reset).toHaveBeenCalled();
      expect(mockUploadComponent.handleRemovesFile).toHaveBeenCalled();
    });
  });
});

// End of unit tests for: onClear
