import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { FetchApiService } from "./fetch-api.service";
import { Observable, map } from "rxjs";

export class CustomValidator {
    static tokenValidator(fetchApiService: FetchApiService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<any> => {
            return fetchApiService
                .getUserInformation(control.value)
                .pipe(
                    map((result) => !result.isActive ? { invalidToken: true } : null ),
                );
        }
    }
}