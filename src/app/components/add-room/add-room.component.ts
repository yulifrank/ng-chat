import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent {
  addRoomForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddRoomComponent>) {
    this.addRoomForm = this.fb.group({
      roomName: ['']
    });
  }

  onSubmit() {
    if (this.addRoomForm.valid) {
      this.dialogRef.close(this.addRoomForm.value.roomName);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
