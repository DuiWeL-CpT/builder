import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Builder, GetContentOptions } from '@builder.io/sdk';
import { BuilderService } from '../../services/builder.service';
import { BuilderComponentService } from '../builder-component/builder-component.service';

@Component({
  selector: 'builder-content',
  templateUrl: './builder-content.component.html',
  styleUrls: ['./builder-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderContentComponent implements OnInit, OnDestroy {
  constructor(
    private element: ElementRef,
    private builderComponentService: BuilderComponentService
  ) {
    builderComponentService.contentComponentInstance = this;
  }

  modelName?: string;

  @Input() useHtml = false;
  @Input() data: any = {};
  @Input() hydrate = true;

  @Input() set content(content) {
    const currentContent = this._content;
    this._content = content;
    const { contentDirectiveInstance } = this.builderComponentService;
    if (!currentContent && content && contentDirectiveInstance) {
      if (!contentDirectiveInstance.requesting) {
        contentDirectiveInstance.reset();
      }
    }
  }
  get content() {
    return this._content;
  }
  private _content: any;

  @Input() options: GetContentOptions | null = null;

  @Output() contentLoad = new EventEmitter<any>();
  @Output() contentError = new EventEmitter<any>();

  get editingMode() {
    return Builder.editingPage;
  }

  ngOnInit() {
    const modelName =
      this.element.nativeElement &&
      (this.element.nativeElement as HTMLElement).getAttribute &&
      (this.element.nativeElement as HTMLElement).getAttribute('builder-model');
    if (modelName) {
      // FIXME: doesn't work on server!
      this.modelName = modelName;
      BuilderService.componentInstances[modelName] = this;
    }
  }

  ngOnDestroy() {
    if (this.modelName) {
      if (BuilderService.componentInstances[this.modelName] === this) {
        delete BuilderService.componentInstances[this.modelName];
      }
    }
  }
}
