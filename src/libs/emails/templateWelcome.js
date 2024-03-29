import { fi } from "date-fns/locale"

export const templeWelcome = ({firstName, lastName, email, matricula, password, timeStart, timeEnd, daystart, daysCourse }) => {
    return `
    <div
      style="
        display: block;
        margin: 0px auto;
        width: 95%;
        background: #f7f7ff;
        padding-top: 50px;
        box-sizing: content-box;
      "
    >
      <div style="display: block">
        <img
          style="display: block; width: 40%; margin: 0px auto"
          src="https://www.cfamex.com/imagenes/LOGOFCA.png"
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
            BIENVENIDO: ${firstName} ${lastName}
          </h4>
          <p
            style="
              text-align: center;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
          >
            A nombre del <strong>CENTRO DE FORMACION ACADEMICA</strong> <br> te damos la más cordial
            bienvenida a nuestra institución y a su vez queremos felicitarte por
            la decisión <br> de superación que acabas de tomar.
          </p>
          <p
            style="
              margin-top: 50px;
              text-align: center;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
          >
            TU NUMERO DE CREDENCIAL
            <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">${matricula}</p>
          </p>      
          <p
            style="
              text-align: center;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
          >
          EL INICIO DE CURSO ES
            <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">${daystart}</p>
          </p>

          <p
          style="
            text-align: center;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          "
        >
        EL HORARIO DE CLASES ES
          <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">Son los ${daysCourse}</p>
          <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">${timeStart} - ${timeEnd}</p>
        </p>
        <p
          style="
            text-align: center;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          "
        >
        Tus Accesos son
          <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">Usuario: ${email}</p>
          <p style="text-align: center; font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold;">Contraseña: ${password}</p>
        </p>    

        </div>
      </div>
      <div style="width: 100%; margin: 50px auto; padding: 0px 0px 50px 0px">
        <a
          style="
            display: block;
            margin: 0px auto;
            width: 200px;
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
        <div style="width: 100%;">
          
          <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold; color: #000000; text-align: center;">Cobranza (11:00 am - 7:00 pm) <br> 444 669 38 89</p>
          <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold; color: #0058a0; text-align: center;">Control Escolar (11:00 am - 7:00 pm) <br> 444 193 73 98</p>
          <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold; color: #e78e19; text-align: center;">www.cfamex.com</p>
          <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-weight: bold; color: #f11212; text-align: center;">controlescolar@cfamex.com</p>
        </div>
        </div>
      </div>
    </div>
    `
}