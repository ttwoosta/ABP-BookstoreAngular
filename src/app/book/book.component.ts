import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookDto, BookService, bookTypeOptions } from '@proxy/books';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from '../shared/shared.adapters';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class BookComponent implements OnInit {

  book = {items: [], totalCount: 0 } as PagedResultDto<BookDto>;

  isModalOpen = false;

  // add bookTYpes as a list of BookType enum members
  bookTypes = bookTypeOptions;
  form: FormGroup;
  selectedBook: BookDto;

  constructor(public readonly list: ListService, private bookService: BookService, private fb: FormBuilder,
    private dateAdapter: NgbDateAdapter<string>) {

  }

  ngOnInit(): void {
    const bookStreamCreator = (query) => this.bookService.getList(query);

    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    })
  }

  createBook(e) {
    this.selectedBook = {} as BookDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editBook(id: string) {
    this.bookService.get(id).subscribe((book) => {
      this.selectedBook = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  // Add buildForm method
  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedBook.name || '', Validators.required],
      type: [this.selectedBook.type || null, Validators.required],
      publishDate: [
        this.selectedBook.publishDate ? new Date(this.selectedBook.publishDate) : 
         null, Validators.required],
      price: [this.selectedBook.price || null, Validators.required]
    });
  }

  save() {
    if (this.form.invalid)
      return;

    console.log(this.form.value);

    const request = this.selectedBook.id ?
      this.bookService.update(this.selectedBook.id, this.form.value) :
      this.bookService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

}
