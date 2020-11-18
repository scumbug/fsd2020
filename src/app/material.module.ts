import { NgModule } from '@angular/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

const MATERIAL = [MatDatepickerModule, MatInputModule, MatRadioModule, MatButtonModule, MatIconModule]

@NgModule({
    imports: MATERIAL,
    exports: MATERIAL
})

export class MaterialModule { }