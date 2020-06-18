import { Component, OnInit, Input, Renderer2, ChangeDetectorRef, ViewChild, ElementRef, Output } from '@angular/core';
import { Option } from '../../interfaces/Option';
import { throwError } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent implements OnInit {

  @Input() options: Option[] = [];
  @Input() label: string;
  @Output() onChanged: EventEmitter<Option> = new EventEmitter();

  @ViewChild('select') select: ElementRef;
  selectedOption: Option = {displayValue: 'Provide options', value:'Provide options', isSelected:true};

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    if (this.options.length <= 0) {
      throw Error("Options are not provided for the custom select!");
    } else {
      let defautValue = this.options.find((x)=> x.isSelected);
      this.selectedOption = defautValue ? defautValue : this.options[0]
    }

  }

   selectColor(value: Option) {
    this.selectedOption = value;
    this.onChanged.emit(value);
    this.hideDropdown(this.select.nativeElement)
  }

   async hideDropdown(el: any) {
    this.renderer.removeAttribute(el, 'tabindex')
    this.renderer.setAttribute(el, 'tabindex', '-1')
  }

}
