let currentPage = 1;
let searchQuery = '';
let sortColumn = 'nombre';
let sortOrder = 'ASC';

function loadSongs() {
    searchQuery = $('#searchInput').val() || '';
    
    $.ajax({
         url: `api.php?action=read&search=${searchQuery}&column=${sortColumn}&order=${sortOrder}&page=${currentPage}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const tbody = $("#dataTable tbody");
            tbody.empty();
            
            data.forEach(song => {
                const tr =` 
                    <tr id="row-${song.id}">
                        <td>${song.nombre}</td>
                        <td>${song.autor}</td>
                        <td>${song.duracion}</td>
                        <td>${song.album}</td>
                        <td>
                            <button onclick="editSong(${song.id})">Editar</button>
                            <button onclick="deleteSong(${song.id})">Eliminar</button>
                        </td>
                    </tr>
               `;
                tbody.append(tr);
            });
        },
        error: function(error) {
            console.error('Error:', error);
            alert("Hubo un problema al cargar las canciones.");
        }
    });
}
function addSong() {
    const nombre = prompt("Nombre de la canción:");
    const autor = prompt("Autor:");
    const duracion = prompt("Duración:");
    const album = prompt("Álbum:");

    if (nombre && autor && duracion && album) {
        $.ajax({
            url: 'api.php?action=create',
            method: 'POST',
            data: {
                nombre: nombre,
                autor: autor,
                duracion: duracion,
                album: album
            },
            success: function(response) {
                console.log('Canción agregada con éxito:', response);

                const newRow = `
                    <tr id="row-${response.id}" style="display: none;">
                        <td>${nombre}</td>
                        <td>${autor}</td>
                        <td>${duracion}</td>
                        <td>${album}</td>
                        <td>
                            <button onclick="editSong(${response.id})">Editar</button>
                            <button onclick="deleteSong(${response.id})">Eliminar</button>
                        </td>
                    </tr>
                `;

                $("#dataTable tbody").prepend(newRow);
                $(`#row-${response.id}`).fadeIn(1500);
            },
            error: function(error) {
                console.error('Error al agregar la canción:', error);
                alert("No se pudo agregar la canción. Inténtalo de nuevo.");
            }
        });
    }
}

function editSong(id) {
    const nombre = prompt("Nuevo nombre de la canción:");
    const autor = prompt("Nuevo autor:");
    const duracion = prompt("Nueva duración:");
    const album = prompt("Nuevo álbum:");

    if (nombre && autor && duracion && album) {
        $.ajax({
            url: 'api.php?action=update',
            method: 'POST',
            data: { id, nombre, autor, duracion, album },
            success: function() {
                $(`#row-${id}`).effect('highlight', { color: '#008000' }, 1500);
                $(`#row-${id} td:nth-child(1)`).text(nombre);
                $(`#row-${id} td:nth-child(2)`).text(autor);
                $(`#row-${id} td:nth-child(3)`).text(duracion);
                $(`#row-${id} td:nth-child(4)`).text(album);
                showDialog('Canción actualizada con éxito.');
            },
            error: function() {
                showDialog('Error al actualizar la canción.', true);
            }
        });
    } else {
        showDialog('Por favor, complete todos los campos.', true);
    }
}

function deleteSong(id) {
   if (confirm("¿Seguro que deseas eliminar este registro?")) {
        $.ajax({
            url: 'api.php?action=delete',
            method: 'POST',
            data: { id: id },
            success: loadSongs,
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }
}



function sortTable(column) {
    sortColumn = column;
    sortOrder = (sortOrder === 'ASC') ? 'DESC' : 'ASCload';

    const tbody = $("#dataTable tbody");
    tbody.fadeOut(500, function () {
        loadSongs();
        tbody.fadeIn(500);
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadSongs();
    }
}

function nextPage() {
    currentPage++;
    loadSongs();
}

function showDialog(message, isError = false) {
    const dialogBox = document.createElement("div");
    dialogBox.textContent = message;
    dialogBox.style.padding = "10px";
    dialogBox.style.border = "1px solid";
    dialogBox.style.backgroundColor = isError ? "#ffcccc" : "#ccffcc";
    dialogBox.style.color = isError ? "#ff0000" : "#008000";
    dialogBox.style.position = "fixed";
    dialogBox.style.top = "20px";
    dialogBox.style.right = "20px";
    dialogBox.style.zIndex = "1000";
    dialogBox.style.borderRadius = "5px";

    document.body.appendChild(dialogBox);

    setTimeout(() => {
        dialogBox.remove();
    }, 3000);
}
