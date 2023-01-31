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
console.log(BBDD)

//registro de usuario nuevo
const btnRegistro = document.getElementById("btn-register");
btnRegistro.addEventListener("click", (e) => {
    e.preventDefault();
    
    const dialog = document.querySelector("#dialogReg");
    const salir = document.getElementById("salir");
    
    //abre el modal de registro
    dialog.showModal();
    salir.addEventListener("click", () => {
        dialog.close();
    });

    //para que el modal se cierre si se clickea afuera
    window.onclick = (e) => {
        if (e.target == dialog) {
          dialog.close();
        }
    }
});

//envia los datos cargados para validar la creacion del usuario
const formReg = document.getElementById("formReg");
formReg.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("click en registrarse2")

    const dialog = document.getElementById("dialogReg")
    window.onclick = (e) => {
        if (e.target == dialog) {
          dialog.close();
        }
    }
    
    const user = document.getElementById("userReg");
    const mail = document.getElementById("mailReg");
    const pass = document.getElementById("passReg");
    const pass2 = document.getElementById("pass2Reg");

    if(validarUsuario(user.value, mail.value, pass.value, pass2.value)){
        guardarUsuario(user.value, mail.value, pass.value);
        createModal("Nuevo Usuario", `
            Usuario creado con exito <br>
            Nombre: <i>${user.value}</i> <br>
            Correo: <i>${mail.value}</i> 
        `);
        console.log("usuario guardado")
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
        createModal("Login", "Usuario o contraseña Incorrectos")
    }else{
        e.preventDefault();
        createModal("Login", "iniciando Sesion...");
        limpiarForm(miForm);
    }
});

//boton de info
const info = document.getElementById("infoIcon");
info.addEventListener("click", () => {
    createModal("Info", `
    Alumno: <i>Marcelo Falasca</i> <br><br>
    Proximamente este Login va a dar entrada a la App del proyecto final.
    `);
});

//agrega el usuario al storage mientras no sea un string vacio o null
const guardarUsuario = (user, mail, pass) => {
    BBDD.push(new User({_user: user, _mail: mail, _pass: pass}));
    localStorage.setItem("users", JSON.stringify(BBDD));
    console.log(BBDD);
}

//devuelve false si no se valida la creacion y true si es valida
const validarUsuario = (user, mail, pass, pass2) => {
    console.log("validando ususario")
    if(BBDD.find(e => e._user === user) !== undefined){
        createModal("Error en registro", ` El usuario "${user}" ya está registrado`);
        return false;
    }
    if(BBDD.find(e => e._mail === mail) != undefined){
        createModal("Error en registro", ` Ya existe una cuenta con el correo: "${mail}"`);
        return false;
    }
    if(pass != pass2){
        createModal("Error en registro", " Las contraseñas no coinciden");
        return false;
    }
    return true;
}

//crea un modal y lo muestra
const createModal = (titulo, mensaje) => {
    const modal = document.getElementById("dialog-alert");
    const dialog = document.getElementById("dialogReg");
    modal.close();
    window.onclick = (e) => {
        if (e.target == modal) {
          modal.close();
         }
    }

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