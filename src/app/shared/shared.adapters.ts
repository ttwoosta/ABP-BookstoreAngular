import { Component, Injectable } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomAdapter extends NgbDateAdapter<string> {
     readonly DELIMITER = '-';
 
     fromModel(value: string | null): NgbDateStruct | null {
         if (value) {
             const date = new Date(value);
             return {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDay(),
             };
         }
         return null;
     }
 
     toModel(date: NgbDateStruct | null): string | null {
        return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
     }
 }
 
 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {
     readonly DELIMITER = '/';
 
     parse(value: string): NgbDateStruct | null {
         if (value) {
            const date = new Date(value);
            return {
               year: date.getFullYear(),
               month: date.getMonth(),
               day: date.getDay(),
            };
         }
         return null;
     }
 
     format(date: NgbDateStruct | null): string {
         return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : '';
     }
 }