import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input } from '@angular/core';
import { delay } from '../../utils/delay';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title: string = "You have forgot to pass a tittle!  "

  @ViewChild('content') content: ElementRef;

  constructor(private renderer: Renderer2, private hostRef: ElementRef) { }

  ngOnInit(): void {

  }

  async open() {
    this.renderer.setStyle(this.hostRef.nativeElement, 'display', 'block')
    await delay(50)

    this.renderer.setStyle(this.hostRef.nativeElement, 'opacity', '1')
    this.renderer.setStyle(this.content.nativeElement, 'opacity', '1')

    this.renderer.setStyle(this.hostRef.nativeElement, 'width', '100%')
    this.renderer.setStyle(this.content.nativeElement, 'width', '50%')

    this.renderer.setStyle(this.hostRef.nativeElement, 'height', '100%')
    this.renderer.setStyle(this.content.nativeElement, 'height', '50%')

    this.renderer.setStyle(this.hostRef.nativeElement, 'border-radius', '0')
    this.renderer.setStyle(this.content.nativeElement, 'border-radius', '.2rem')


  }

  stopPropagation(e: Event) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  }

  async close() {
    this.renderer.setStyle(this.hostRef.nativeElement, 'opacity', '0')
    this.renderer.setStyle(this.content.nativeElement, 'opacity', '0')
    this.renderer.setStyle(this.hostRef.nativeElement, 'border-radius', '50%')
    this.renderer.setStyle(this.content.nativeElement, 'border-radius', '50%')
    this.renderer.setStyle(this.hostRef.nativeElement, 'width', '0')
    this.renderer.setStyle(this.content.nativeElement, 'width', '0')
    this.renderer.setStyle(this.hostRef.nativeElement, 'height', '0')
    this.renderer.setStyle(this.content.nativeElement, 'height', '0')

    await delay(400)
    this.renderer.setStyle(this.hostRef.nativeElement, 'display', 'none')


  }

}
