import { NgModule } from '@angular/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatInputModule } from '@angular/material/input'
import { MatRadioModule } from '@angular/material/radio'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list'
import { MatDialogModule } from '@angular/material/dialog'

const MATERIAL = [MatDatepickerModule, MatInputModule, MatRadioModule, MatButtonModule, MatIconModule, MatGridListModule, MatToolbarModule, MatCardModule, MatListModule, MatDialogModule]

@NgModule({
    imports: MATERIAL,
    exports: MATERIAL
})

export class MaterialModule { }