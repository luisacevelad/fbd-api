const API_BASE = 'https://fbd-api-cvy5.onrender.com/bares';
const barId = parseInt(apex.item('P_BAR_ID').getValue());

function cargarComentarios() {

    fetch(`${API_BASE}/bares/${barId}/comentarios`)
        .then(res => res.json())
        .then(data => {

            const container =
                document.getElementById('comentarios-container');

            if (!data || data.length === 0) {

                container.innerHTML =
                    '<p>No hay comentarios aÃºn. Â¡SÃ© el primero!</p>';

                return;
            }

            container.innerHTML = data.map(c => `

                <div style="
                    border:1px solid #DDD;
                    border-radius:10px;
                    padding:14px;
                    margin-bottom:12px;
                    background:#FFF;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:8px;
                    ">

                        <strong>
                            ${c.usuario || 'AnÃ³nimo'}
                        </strong>

                        <span style="
                            color:#777;
                            font-size:12px;
                        ">
                            ${c.fecha
                                ? new Date(c.fecha)
                                    .toLocaleDateString('es-CO')
                                : ''
                            }
                        </span>

                    </div>

                    <div style="
                        margin-bottom:8px;
                        color:#f5b301;
                        font-size:18px;
                    ">
                        ${'â­'.repeat(c.calificacion || 0)}
                    </div>

                    <div>
                        ${c.comentario || ''}
                    </div>

                </div>

            `).join('');

        })

        .catch(err => {

            console.error(err);

            document.getElementById('comentarios-container').innerHTML =
                '<p style="color:red;">Error cargando comentarios.</p>';
        });
}

function enviarComentario() {

    const comentario =
        apex.item('COMENTARIO').getValue();

    const calificacion =
        parseInt(apex.item('CALIFICACION').getValue());

    if (!comentario.trim()) {

        apex.message.clearErrors();

        apex.message.showErrors([
            {
                type: "error",
                location: "page",
                message: "El comentario no puede estar vacÃ­o.",
                unsafe: false
            }
        ]);

        return;
    }

    if (!calificacion || calificacion < 1 || calificacion > 5) {

        apex.message.clearErrors();

        apex.message.showErrors([
            {
                type: "error",
                location: "page",
                message: "La calificaciÃ³n debe estar entre 1 y 5.",
                unsafe: false
            }
        ]);

        return;
    }

    fetch(`${API_BASE}/bares/${barId}/comentarios`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            comentario: comentario,
            calificacion: calificacion,
            usuario: apex.env.APP_USER

        })

    })

    .then(res => {

        if (!res.ok) {
            throw new Error('Error HTTP');
        }

        return res.json();
    })

    .then(data => {

        apex.message.clearErrors();

        apex.message.showPageSuccess(
            'Comentario guardado correctamente.'
        );

        apex.item('COMENTARIO').setValue('');
        apex.item('CALIFICACION').setValue('');

        cargarComentarios();
    })

    .catch(err => {

        console.error(err);

        apex.message.clearErrors();

        apex.message.showErrors([
            {
                type: "error",
                location: "page",
                message: "Error enviando el comentario.",
                unsafe: false
            }
        ]);
    });
}