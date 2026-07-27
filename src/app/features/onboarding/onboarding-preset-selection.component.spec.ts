import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { GlobalConfigService } from '../config/global-config.service';
import { LS } from '../../core/persistence/storage-keys.const';

describe('OnboardingPresetSelectionComponent', () => {
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let cfgSignal: WritableSignal<{ sync: { isEnabled: boolean } }>;
  let afterClosed$: Subject<void>;

  const setup = (): void => {
    cfgSignal = signal({ sync: { isEnabled: false } });
    afterClosed$ = new Subject<void>();

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue({
      afterClosed: () => afterClosed$.asObservable(),
    } as unknown as MatDialogRef<unknown>);

    const mockGlobalConfig = jasmine.createSpyObj('GlobalConfigService', [], {
      cfg: cfgSignal,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: GlobalConfigService, useValue: mockGlobalConfig },
      ],
    });
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
