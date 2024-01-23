import nodemailer from 'nodemailer';
import {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SERVICE,
    MAIL_USER,
    MAIL_PASSWORD
} from '../config';




const html = `
<div
style="
  display: block;
  margin: 0px auto;
  width: 80%;
  background: #f7f7ff;
  height: 1100px;
"
>
<div style="display: block">
  <img
    style="display: block; width: 30%; margin: 0px auto"
    src="${'./logo.png'}"
    alt=""
  />
</div>
<div style="width: 90%; margin: 0px auto">
  <div style="width: 100%">
    <h2
      style="
        margin-top: 80px;
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      "
    >
      CARTA DE BIENVENIDA
    </h2>
    <h4
      style="
        margin-top: 50px;
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      "
    >
      BIENVENIDO: Emilio Córdova Morales
    </h4>
    <p
      style="
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      "
    >
      A nombre del CENTRO DE FORMACION ACA DEMICA te damos la más cordial
      bienvenida a nuestra institución y a su vez queremos felicitarte por
      la decisión de superación que acabas de tomar.
    </p>
    <p
      style="
        margin-top: 50px;
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      "
    >
      TU NUMERO DE CREDENCIAL
      <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">9044</p>
    </p>
    <p
      style="
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      "
    >
    TU CURSO ES
      <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;"> Inglés BÁSICO Martes y 
        Jueves de 8 PM a 10 PM</p>
    </p>
    <p
      style="
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      "
    >
    EL INICIO DE CURSO ES
      <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;"> 09 de Octubre del 2024</p>
    </p>

  </div>
</div>
<div style="width: 30%; margin: 100px auto 50px">
  <a
    style="
      display: block;
      text-decoration: none;
      background: #4f46e5;
      color: white;
      font-weight: bold;
      padding: 20px 40px 20px;
      border-radius: 10px;
      text-align: center;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    "
    href="https://fca-client-production.up.railway.app/"
    >INICIAR SESION</a
  >
</div>
<hr>
<div style="width: 90%; margin: 0px auto">
  <div style="width: 100%">
    <p
      style="
        margin-top: 20px;
        text-align: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 12px;
        color: #ff4b4b;
      "
    >
    EN CASO DE CANCELACIÓN DEL ALUMNO NO SE REEMBOLSARÁ EL PAGO
      <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 11px;">Si el alumno no acepta la invitación enviada por parte de la institución para ingresar a su salón virtual.</p>
      <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 11px;">A falta de información por no tomar las llamadas de parte de control escolar.</p>
      <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 11px;">Después de 3 días de recibir información importante por parte de la institución y no obtener respuesta. </p>
    </p>
    <p
    style="
      margin-top: 50px;
      text-align: center;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      font-size: 14px;
      font-weight: bold;
    "
  >
  A continuación, te proporcionamos nuestro directorio de contactos con su respectivo horario de atención: 
  </p>
  <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; ">
    <div style="width: 25%; background-color: #4f46e5; text-align: center; padding: 15px; border-radius: 5px;">
      <a style="text-decoration: none; color: #ffffff; font-family: Verdana, Geneva, Tahoma, sans-serif;" href="https://www.cfamex.com/index.html">www.cfamex.com</a>
    </div>
    <div style="width: 25%; background-color: #4f46e5; text-align: center; padding: 15px; border-radius: 5px;">
      <a style="text-decoration: none; color: #ffffff; font-family: Verdana, Geneva, Tahoma, sans-serif;" href="">controlescolar@cfamex.com</a>
    </div>
    <div style="width: 25%; background-color: #4f46e5; text-align: center; padding: 15px; border-radius: 5px;">
      <a style="text-decoration: none; color: #ffffff; font-family: Verdana, Geneva, Tahoma, sans-serif;" href="">444 193 73 98</a>
    </div>
  </div>
  </div>
</div>
</div>
`

export const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            service: MAIL_SERVICE,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: MAIL_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: html
        };
        // Enviamos el correo electrónico
        const info = await transporter.sendMail(mailOptions);

        return info;
    } catch (error) {
        console.log('Error al enviar el correo electrónico:', error);
        throw error;
    }
}