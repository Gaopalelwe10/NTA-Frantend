import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChargesPage } from './charges.page';

describe('ChargesPage', () => {
  let component: ChargesPage;
  let fixture: ComponentFixture<ChargesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChargesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
