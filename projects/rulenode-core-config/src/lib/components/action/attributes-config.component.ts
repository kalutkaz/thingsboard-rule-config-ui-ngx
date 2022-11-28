import { Component, OnDestroy } from '@angular/core';
import { AppState } from '@core/public-api';
import { AttributeScope, RuleNodeConfiguration, RuleNodeConfigurationComponent, telemetryTypeTranslations } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tb-action-node-attributes-config',
  templateUrl: './attributes-config.component.html',
  styleUrls: []
})
export class AttributesConfigComponent extends RuleNodeConfigurationComponent implements OnDestroy{

  attributesConfigForm: FormGroup;

  AttributeScope = AttributeScope;
  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;
  private destroy$ = new Subject();

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.attributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.attributesConfigForm = this.fb.group({
      scope: [configuration ? configuration.scope : null, [Validators.required]],
      notifyDevice: [configuration ? configuration.notifyDevice : true, []],
      sendAttributesUpdatedNotification: [configuration ? configuration.sendAttributesUpdatedNotification : false, []]
    });

    this.attributesConfigForm.get('scope').valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value !== AttributeScope.SHARED_SCOPE) {
        this.attributesConfigForm.get('notifyDevice').patchValue(false, {emitEvent: false});
      }
      if (value === AttributeScope.CLIENT_SCOPE) {
        this.attributesConfigForm.get('sendAttributesUpdatedNotification').patchValue(false, {emitEvent: false});
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
