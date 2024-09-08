// Unit tests for: showLoadingSpinner

import { LoadingService } from '../loading.service';

describe('LoadingService.showLoadingSpinner() showLoadingSpinner method', () => {
  let loadingService: LoadingService;

  beforeEach(() => {
    loadingService = new LoadingService();
  });

  describe('Happy Path', () => {
    it('should set loading signal to true', () => {
      // Test to ensure the loading signal is set to true
      loadingService.showLoadingSpinner();
      expect(loadingService.isLoading().value).toBe(true);
    });

    it('should emit true on progressSubject', (done) => {
      // Test to ensure the progressSubject emits true
      loadingService.isLoading$.subscribe((value) => {
        if (value) {
          expect(value).toBe(true);
          done();
        }
      });
      loadingService.showLoadingSpinner();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple calls gracefully', () => {
      // Test to ensure multiple calls to showLoadingSpinner do not cause issues
      loadingService.showLoadingSpinner();
      loadingService.showLoadingSpinner();
      expect(loadingService.isLoading().value).toBe(true);
    });

    it('should not throw error when called without subscribers', () => {
      // Test to ensure no errors are thrown when there are no subscribers
      expect(() => loadingService.showLoadingSpinner()).not.toThrow();
    });
  });
});

// End of unit tests for: showLoadingSpinner
