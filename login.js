/*
PreEntrega 3
Marcelo Falasca

Login:
    El sistema compara el usuario y contraseña ingresado contra los datos almacenados en el localStorage.
    Si el usuario no existe, no entra.
    Cuenta con la opcion de registrarse para guardar al usuario en el localStorage
    Mientras cumpla que:
        - No existe un usuario con el mismo nombre
        - El mail ingresado no esté registrado con otro usuario
        - Y que coincidan las contraseñas ingresadas
*/

//cargo en una variable el contenido del Local Storage
let BBDD = JSON.parse(localStorage.getItem("users"));
//si es la primera vez, crea un array vacio
if(BBDD == null) BBDD = [];
console.log(BBDD);

//Abre modal de registro
const btnRegistro = document.getElementById("btn-register");
btnRegistro.addEventListener("click", (e) => {
    e.preventDefault();
    
    const dialog = document.querySelector("#dialogReg");
    const salir = document.getElementById("salir");
    
    //abre el modal de registro
    dialog.showModal();
    clickAfuera();
    salir.addEventListener("click", () => {
        dialog.close();
    });
});

//Registro - Envia los datos para validarlos y guardar ususario
const formReg = document.getElementById("formReg");
formReg.addEventListener("submit", (e) => {
    e.preventDefault();
    clickAfuera();

    const dialog = document.getElementById("dialogReg")
    const user = document.getElementById("userReg");
    const mail = document.getElementById("mailReg");
    const pass = document.getElementById("passReg");
    const pass2 = document.getElementById("pass2Reg");
    const date = document.getElementById("dateReg");
    const edad = calcularEdad(date.value);

    if(validarUsuario(user.value, mail.value, pass.value, pass2.value, date.value)){
        guardarUsuario(user.value, mail.value, pass.value, date.value, edad);
        createModal("Nuevo Usuario", `
            Usuario creado con exito <br>
            Nombre: <i>${user.value}</i> <br>
            Correo: <i>${mail.value}</i> <br>
            Edad: <i>${edad}</i>
        `);
        console.log("usuario guardado");
        dialog.close()
        limpiarForm(formReg);
    }
});

//login
const miForm = document.getElementById("form");
    miForm.addEventListener("submit", (e) => {

    const user = document.getElementById("user");
    const pass = document.getElementById("pass");

    //compara los datos ingresados con el Local Storage, si no existen, previene la accion del form, si existe, inicia sesion
    let found = BBDD.find(e => (e._user === user.value && e._pass === pass.value));
    if(found == undefined){
        e.preventDefault();
        createModal("Iniciar sesion", "Usuario o contraseña Incorrectos")
    }else{
        e.preventDefault();
        createModal("iniciar sesion", `
            Iniciando Sesion... <br>
            Usuario: ${user.value}
        `);
        limpiarForm(miForm);
    }
});

//boton de info
const info = document.getElementById("infoIcon");
info.addEventListener("click", () => {
    clickAfuera();
    createModal("Info", `
    Alumno: <i>Marcelo Falasca</i> <br><br>
    Proximamente este Login va a dar entrada a la App del proyecto final.
    `);
});

//agrega el usuario al storage mientras no sea un string vacio o null
const guardarUsuario = (user, mail, pass, date, edad) => {
    BBDD.push(new User({_user: user, _mail: mail, _pass: pass, _date: date, _age: edad}));
    localStorage.setItem("users", JSON.stringify(BBDD));
    console.log(BBDD);
}

//devuelve false si no se valida la creacion y true si es valida
const validarUsuario = (user, mail, pass, pass2, date) => {
    console.log("validando ususario");
    let error = "Error en registro";

    if(BBDD.find(e => e._user === user) !== undefined){
        createModal(error, ` El usuario "${user}" ya está registrado`);
        return false;
    }
    if(BBDD.find(e => e._mail === mail) != undefined){
        createModal(error, ` Ya existe una cuenta con el correo: "${mail}"`);
        return false;
    }
    if(calcularEdad(date) < 18 || calcularEdad(date) > 100){
        createModal(error, `La edad debe estár entre 18 y 99 años`);
        return false;
    }
    if(pass != pass2){
        createModal(error, " Las contraseñas no coinciden");
        return false;
    }
    return true;
}

//crea un modal y lo muestra
const createModal = (titulo, mensaje) => {
    const modal = document.getElementById("dialog-alert");

    modal.innerHTML = `
            <h2> ${titulo} </h2>
            <h3> ${mensaje} </h3>
            <button id="btn-salir"> X </button>
        `;

    modal.showModal()
    const salir = document.getElementById("btn-salir");
    salir.addEventListener("click", () => {
        modal.removeAttribute(open);
        modal.close();
    });
}

//limpia los valores del form
const limpiarForm = (form) => {
    form.reset();
}

//calcula la edad y la devuelve
const calcularEdad = (date) => {
    let cumple = new Date(date);
    let diferencia = new Date(Date.now() - cumple.getTime());
    let edad = diferencia.getFullYear() - 1970;
    return edad;
}

//verifica si se hace click fuera del modal, lo cierra
//como alternativa al boton salir
const clickAfuera = () => {
    const modal = document.getElementById("dialog-alert");
    const dialog = document.getElementById("dialogReg");
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.close();
        }
        if (e.target == dialog) {
            dialog.close()
        }
    }
}