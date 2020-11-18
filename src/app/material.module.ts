import { NgModule } from '@angular/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatButtonModule } from '@angular/material/button'

const MATERIAL = [MatDatepickerModule, MatInputModule, MatRadioModule, MatButtonModule ]

@NgModule({
    imports: MATERIAL,
    exports: MATERIAL
})

export class MaterialModule { }