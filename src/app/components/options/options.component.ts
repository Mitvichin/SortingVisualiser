import { Component, OnInit, Renderer2, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { delay } from 'src/app/shared/utils/delay';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
@ViewChild('options') options: ElementRef;

  selectedValue:string = "Placeholder"

  constructor(private renderer: Renderer2, private detector: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  private selectColor(value:string){
    this.selectedValue = value;
    this.hideDropdown(this.options.nativeElement)
  }

  private async hideDropdown(el:any){
    this.renderer.removeAttribute(el,'tabindex')
    this.renderer.setAttribute(el,'tabindex', '-1')
  }
}
