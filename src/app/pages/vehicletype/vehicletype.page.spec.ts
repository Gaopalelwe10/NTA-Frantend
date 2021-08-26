import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VehicletypePage } from './vehicletype.page';

describe('VehicletypePage', () => {
  let component: VehicletypePage;
  let fixture: ComponentFixture<VehicletypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicletypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicletypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
