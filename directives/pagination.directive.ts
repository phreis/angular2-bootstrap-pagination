import {Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, OnChanges} from "angular2/core";
import {NgModel, NgIf, NgFor, NgClass, FORM_DIRECTIVES, ControlValueAccessor} from "angular2/common";

@Component({
  selector: 'ng-pagination[ngModel]',
  directives: [FORM_DIRECTIVES, NgIf, NgFor, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
              <ul class="pagination">
                  <li *ngIf="previousItemValid && firstText" (click)="firstPage()"><a href="#" [innerHTML]="firstText">First</a></li>
                  <li> <a *ngIf="previousItemValid" (click)="previousPage(nextItem)" aria-label="Previous"> <span aria-hidden="true">&laquo;</span> </a> </li>
                  <li *ngFor="let pageNo of pageList" [ngClass]="{'active':seletedPage === pageNo}">
                      <a (click)="setCurrentPage(pageNo)">{{pageNo}}</a>
                  </li>                
                  <li> <a  *ngIf="nextItemValid" (click)="nextPage(nextItem)" aria-label="Next"> <span aria-hidden="true">&raquo;</span> </a> </li>
                  <li><a *ngIf="nextItemValid && lastText" (click)="lastPage()" [innerHTML]="lastText" >Last</a></li>
                </ul>

`
})
export class PaginationDirective implements ControlValueAccessor, OnInit, OnChanges {
  @Input("previous-text") previousText: string;
  @Input("next-text") nextText: string;
  @Input("first-text") firstText: string;
  @Input("last-text") lastText: string;
  @Input("totalItems") totalItems: number;
  @Input("currentPage") cPage: number;
  @Input("maxSize") pageSize: number;
  @Input("boundaryLinks") boundaryLinks: boolean;
  @Output("pageChanged") pageChanged = new EventEmitter();
  currentpage: number;
  pageList: Array<number> = [];
  private onChange: Function;
  private onTouched: Function;
  private seletedPage: number;
  private nextItem: number;
  private previousItem: number;
  private nextItemValid: boolean;
  private previousItemValid: boolean;

  constructor(private pageChangedNgModel: NgModel) {
    this.pageChangedNgModel.valueAccessor = this;

  }
  ngOnInit() {
    this.doPaging();
  }
  doPaging() {
    this.pageList = [];
    var i, count;
    this.seletedPage = this.currentpage;
    var totalSize =(this.totalItems / this.pageSize)+(this.totalItems % this.pageSize ===0 ? 0 : 1);
    for (i = (this.currentpage), count = 0; i < totalSize && count < this.pageSize; i++ , count++) {
      this.pageList.push(i);
    }
    //next validation
    if (i < (this.totalItems / this.pageSize)) {
      this.nextItemValid = true;
      this.nextItem = i;
    } else {
      this.nextItemValid = false;
    }
    //previous validation
    if ((this.currentpage) > 1) {
      this.previousItemValid = true;
      this.previousItem = (this.currentpage * this.pageSize) - 1;
    } else {
      this.previousItemValid = false;
    }
  }
  setCurrentPage(pageNo) {
    this.seletedPage = pageNo;
    this.currentpage = pageNo;
    this.pageChageListner();
  }
  firstPage() {
    this.currentpage = 1;
    this.seletedPage = 1;
    this.pageChageListner();
  }
  lastPage() {
    var totalPages = (this.totalItems / this.pageSize);
    var lastPage = (totalPages) - (totalPages % this.pageSize === 0 ? this.pageSize : totalPages % this.pageSize) + 1;
    this.currentpage = lastPage;
    this.seletedPage = lastPage;
    this.pageChageListner();
  }
  nextPage(pageNo) {
    this.currentpage = pageNo;
    this.seletedPage = pageNo;
//    this.pageChangedNgModel.viewToModelUpdate(pageNo);
    this.pageChageListner();
  }
  previousPage(pageNo) {
    this.currentpage = pageNo - this.pageSize;
    this.seletedPage = this.currentpage;
//    this.pageChangedNgModel.viewToModelUpdate(this.currentpage);
    this.pageChageListner();
  }
  writeValue(value: string): void {
    if (!value) return;
    this.setValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }
  setValue(currentValue) {
    this.currentpage = currentValue;
  }
  pageChageListner() {
    this.pageChangedNgModel.model = this.seletedPage;
     this.pageChangedNgModel.valueAccessor.writeValue(this.seletedPage);
    this.pageChangedNgModel.viewToModelUpdate(this.seletedPage);
    this.doPaging();
    this.pageChanged.emit({
      page: this.seletedPage,
      itemsPage: this.pageSize
    })
  }

  ngOnChanges(...args: any[]) {
    console.log(args);
    this.doPaging();
  }
}