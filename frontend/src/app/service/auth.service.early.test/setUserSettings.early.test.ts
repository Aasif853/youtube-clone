// Unit tests for: setUserSettings

import { UserInterface } from '../../types/interfaces';

import { AuthService } from '../auth.service';

// Mock class for HttpClient
class MockHttpClient {
  public get = jest.fn();
  public post = jest.fn();
}

describe('AuthService.setUserSettings() setUserSettings method', () => {
  let authService: AuthService;
  let mockHttpClient: MockHttpClient;

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    authService = new AuthService(mockHttpClient as any);
  });

  describe('Happy Path', () => {
    it('should update userSettingsSource with the provided user data', () => {
      // Arrange: Create a mock user data
      const mockUserData: UserInterface = {
        email: 'test@example.com',
        name: 'Test User',
      };

      // Act: Call setUserSettings with mock user data
      authService.setUserSettings(mockUserData);

      // Assert: Verify that userSettingsSource has been updated
      expect(authService.userSettingsSource.value).toEqual(mockUserData);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined user data gracefully', () => {
      // Arrange: Define undefined user data
      const undefinedUserData: UserInterface = undefined as any;

      // Act: Call setUserSettings with undefined user data
      authService.setUserSettings(undefinedUserData);

      // Assert: Verify that userSettingsSource is set to undefined
      expect(authService.userSettingsSource.value).toBeUndefined();
    });

    it('should handle null user data gracefully', () => {
      // Arrange: Define null user data
      const nullUserData: UserInterface = null as any;

      // Act: Call setUserSettings with null user data
      authService.setUserSettings(nullUserData);

      // Assert: Verify that userSettingsSource is set to null
      expect(authService.userSettingsSource.value).toBeNull();
    });

    it('should handle partial user data', () => {
      // Arrange: Create partial user data
      const partialUserData: UserInterface = {
        email: 'partial@example.com',
      } as any;

      // Act: Call setUserSettings with partial user data
      authService.setUserSettings(partialUserData);

      // Assert: Verify that userSettingsSource has been updated with partial data
      expect(authService.userSettingsSource.value).toEqual(partialUserData);
    });
  });
});

// End of unit tests for: setUserSettings
