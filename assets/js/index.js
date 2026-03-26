const domain = "https://site-new-world-cursos.vercel.app";

document.addEventListener("click", async (e) => {
    if (e.target.id === "send-curriculo") {
        try {
            const dados = await dadosCurriculo();

            // 🔒 validação antes de enviar
            if (!dados.nome || !dados.email) {
                return alert("Preencha nome e email");
            }

            if (!dados.curriculo) {
                return alert("Selecione um currículo (PDF)");
            }

            if (dados.curriculo.type !== "application/pdf") {
                return alert("Apenas PDF permitido");
            }

            const res = await enviarCurriculo("POST", "/curriculo", dados);

            console.log(res);
            alert("Enviado com sucesso!");

        } catch (err) {
            console.error(err);
            alert("Erro ao enviar");
        }
    }

    if (e.target.classList.contains("wpp-btn")) {
        const messagem = "Olá! Tudo bem? Encontrei vocês pelo site e gostaria de obter mais informações sobre os cursos disponíveis.";
        const texto = encodeURIComponent(messagem);

        if (window.innerWidth < 1000) {
            return window.open(`https://wa.me/556136136666?text=${texto}`, "_blank");
        }

        window.open(`https://web.whatsapp.com/send?phone=556136136666&text=${texto}`, "_blank");
    }

    if(e.target.id === "enviar-inscricao"){
        const matricula = await dadosMatricula()
        console.log(matricula   )
        enviarMatricula("POST", "/matricula", matricula )
   
    }

});

async function dadosCurriculo() {
    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const curriculo = document.getElementById("curriculoFile");

    const file = curriculo.files[0];

    console.log(nome.value, email.value, file);

    return {
        nome: nome.value.trim(),
        email: email.value.trim(),
        curriculo: file || null
    };
}

async function dadosMatricula() {
    const nome = document.querySelector("#nome-compl")
    const numero = document.querySelector("#numero")
    const curso = document.querySelector("#select-curso")


    return {
        nome: nome.value.trim(),
        numero: numero.value.trim(),
        curso: curso.value.trim()
    }
}

const enviarCurriculo = async (METHOD, ROTA, DADOS) => {
    let options = {
        method: METHOD
    };

    // 🔥 detecta qualquer File (não só curriculo)
    const temArquivo = Object.values(DADOS).some(v => v instanceof File);

    if (temArquivo) {
        const formData = new FormData();

        for (let key in DADOS) {
            if (DADOS[key] !== null && DADOS[key] !== undefined) {
                formData.append(key, DADOS[key]);
            }
        }

        options.body = formData;

    } else {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(DADOS);
    }

    const res = await fetch(domain + ROTA, options);

    // 🔥 evita erro se backend não retornar JSON
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        return await res.json();
    } else {
        return await res.text();
    }
};


const enviarMatricula = async (METHOD, ROTA, DADOS) => {
    const res = await fetch(domain+ROTA,{
        method:METHOD,
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(DADOS)

    })

    if(res.ok){
        alert("Solicitação de matrícula enviada com sucesso!")
        location.reload()
    }

    const data = await res.json()
    return data;
}