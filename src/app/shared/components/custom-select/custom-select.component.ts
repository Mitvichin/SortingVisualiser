import { Component, OnInit, Input, Renderer2, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Option } from '../../interfaces/Option';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {

  @Input() selectOptions: Option[] = [];
  @ViewChild('options') options: ElementRef;
  selectedValue:string = "Placeholder"

  constructor(private renderer: Renderer2, private detector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.selectOptions.push({displayValue: "test", value: "iliq"})
    this.selectOptions.push({displayValue: "test2", value: "iliq2"})
    this.selectOptions.push({displayValue: "test3", value: "iliq3"})
    this.selectOptions.push({displayValue: "test4", value: "iliq4"})
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
