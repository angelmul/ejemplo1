import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { EditarAlumnoPage } from '../editar-alumno-page/editar-alumno-page.page';
import { Alumno } from '../modelo/Alumno';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  private alumnos = new Array<Alumno>();

  constructor(private apiService : ApiServiceProvider , public alertController : AlertController , public modalController : ModalController , public toastController : ToastController) {}
  
  
  ngOnInit(): void {
   this.apiService.getAlumnos().subscribe((resultadoConsultaAlumnos)=>{
     this.alumnos = new Array<Alumno>();
     resultadoConsultaAlumnos.forEach((datosAlumno:any) => {
        let alumnoJSONObject=datosAlumno.payload.doc.data();
        alumnoJSONObject.id=datosAlumno.payload.doc.id,
        this.alumnos.push(
          Alumno.createFromJsonObject(alumnoJSONObject)
        );       
     });
   });
  }

  eliminarAlumno(indice:number){

    var urlAvatar=this.alumnos[indice].avatar;

    this.apiService.eliminarAlumno(this.alumnos[indice].id)

    .then( () => {

      //los datos del alumno se han eliminado correctamente de cloud firestore

      //elimino la imagen de avatar del storage de firebase

      this.apiService.removeImage(urlAvatar);

      //this.alumnos.splice(indice,1);  No hace falta quitarlo del array. Se recarga todo el array de forma automática

    })

    .catch( (error:string) => {

        this.presentToast("Error al borrar: "+error);

    });

  }//end_eliminar_alumno


  
  async modificarAlumno(indice:number) {
    let alumno=this.alumnos[indice];
    const alert = await this.alertController.create({
      header: 'Modificar',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          value: alumno.first_name,
          placeholder: 'first_name'
        },
        {
          name: 'last_name',
          type: 'text',
          id: 'last_name',
          value: alumno.last_name,
          placeholder: 'last_name'
        },
        {
          name: 'email',
          id: 'email',
          type: 'text',
          value: alumno.email,
          placeholder: 'email'
        },
        {
          name: 'gender',
          id: 'gender',
          type: 'text',
          value: alumno.gender,
          placeholder: 'gender'
        },
        {
          name: 'avatar',
          value: alumno.avatar,
          type: 'url',
          placeholder: 'avatar'
        },
        {
          name: 'address',
          value: alumno.address,
          type: 'text',
          placeholder: 'address'
        },
        {
          name: 'city',
          value: alumno.city,
          type: 'text',
          placeholder: 'city'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, 
        {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            var alumnoModificado:Alumno=new Alumno(alumno.id,
              data['first_name'],
              data['last_name'],
              data['email'],
              data['gender'],
              data['avatar'],
              data['address'],
              data['city']);
            this.apiService.modificarAlumno(alumno.id,alumnoModificado)
              .then( ()=> {
               console.log("alumno modificado");
              })
              .catch( (error:string) => {
                  console.log(error);
              });
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }//end_modificarAlumno

async nuevoAlumno(){
  const modal = await this.modalController.create({
    component: EditarAlumnoPage,
    componentProps:{
      'alumnoJson':JSON.stringify(new Alumno(-1,"","","","","","",""))
    }
  });
  modal.onDidDismiss().then((data)=>{
    if(data['data']!=null){
      let alumnoJSON = JSON.parse(data['data']);
      let alumnoNuevo:Alumno = Alumno.createFromJsonObject(alumnoJSON);

      this.apiService.insertarAlumno(alumnoNuevo)
      .then((alumno:Alumno)=>{
        this.alumnos.push(alumno);
      })
      .catch((error:string)=>{
        //this.presentToast("Error al insertar: "+error);
        console.log(error);
      });
    }
  });
  return await modal.present();
}//end nuevo alumno

async presentToast(message:string) {

  const toast = await this.toastController.create({

    message: message,

    duration: 2000

  });

  toast.present();

}

}


