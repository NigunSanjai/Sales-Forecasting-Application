import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastpopupComponent } from './forecastpopup.component';

describe('ForecastpopupComponent', () => {
  let component: ForecastpopupComponent;
  let fixture: ComponentFixture<ForecastpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
