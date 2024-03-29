export const updatedPassword = ({ password }) => {
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
            ACTUALIZACION DE CONTRASENA
          </h2>
          <p
            style="
              text-align: center;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
            "
          >
            Tu contraseña se actualizo correctamente. <br />
            Tu nueva es: ${password}
          </p>
        </div>
      </div>
      <div style="width: 100%; margin: 50px auto 50px">
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
      <hr />
      <div style="width: 100%; margin: 50px auto; padding: 0px 0px 50px 0px">
        <p
          style="
            margin-top: 50px;
            text-align: center;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font-size: 14px;
            font-weight: bold;
          "
        >
          A continuación, te proporcionamos nuestro directorio de contactos con
          su respectivo horario de atención:
        </p>
        <div style="width: 100%; margin: 50px auto; padding: 0px 0px 50px 0px">
          <p
            style="
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: bold;
              color: #000000;
              text-align: center;
            "
          >
            Cobranza (11:00 am - 7:00 pm) <br />
            444 669 38 89
          </p>
          <p
            style="
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: bold;
              color: #0058a0;
              text-align: center;
            "
          >
            Control Escolar (11:00 am - 7:00 pm) <br />
            444 193 73 98
          </p>
          <p
            style="
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: bold;
              color: #e78e19;
              text-align: center;
            "
          >
            www.cfamex.com
          </p>
          <p
            style="
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              font-weight: bold;
              color: #f11212;
              text-align: center;
            "
          >
            controlescolar@cfamex.com
          </p>
        </div>
      </div>
    </div>
    `
}