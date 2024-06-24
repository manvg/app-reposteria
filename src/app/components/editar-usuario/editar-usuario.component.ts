import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.models';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [  MatIconModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: [data.usuario.nombre, Validators.required],
      apellidos: [data.usuario.apellidos, Validators.required],
      email: [data.usuario.email, Validators.required],
      perfil: [data.usuario.perfil, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.form.valid) {
      const updatedUser: Usuario = {
        ...this.data.usuario,
        nombre: this.form.get('nombre')?.value,
        apellidos: this.form.get('apellidos')?.value,
        perfil: this.form.get('perfil')?.value
      };
      this.dialogRef.close(updatedUser);
    }
  }
}
