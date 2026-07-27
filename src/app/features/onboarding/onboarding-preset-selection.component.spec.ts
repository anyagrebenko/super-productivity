import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

import { GlobalConfigService } from '../config/global-config.service';
import { LS } from '../../core/persistence/storage-keys.const';

describe('OnboardingPresetSelectionComponent', () => {
  const setup = (): void => {
    const mockGlobalConfig = jasmine.createSpyObj('GlobalConfigService', [], {});

    TestBed.configureTestingModule({
      providers: [{ provide: GlobalConfigService, useValue: mockGlobalConfig }],
    });

    runInInjectionContext(TestBed.inject(EnvironmentInjector), () => {});
  };

  beforeEach(() => {
    localStorage.removeItem(LS.ONBOARDING_PRESET_DONE);
    localStorage.removeItem(LS.ONBOARDING_HINTS_DONE);
    setup();
  });

  afterEach(() => {
    localStorage.removeItem(LS.ONBOARDING_PRESET_DONE);
    localStorage.removeItem(LS.ONBOARDING_HINTS_DONE);
  });
});
