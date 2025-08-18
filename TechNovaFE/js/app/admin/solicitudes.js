import Solicitud from '../models/Solicitud.js';

export const getSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find({ estado: 'pendiente' });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const aprobarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { estado: 'aprobada' },
      { new: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json({ message: 'Solicitud aprobada', solicitud });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const solicitud = await Solicitud.findByIdAndUpdate(
      id,
      { estado: 'rechazada', motivoRechazo: motivo },
      { new: true }
    );
    
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }
    
    res.json({ message: 'Solicitud rechazada', solicitud });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const solicitudesBody = document.getElementById("solicitudes-emprendimientos-rows");

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('/api/solicitudes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      return [];
    }
  };

  const renderSolicitudes = async () => {
    const solicitudes = await fetchSolicitudes();
    solicitudesBody.innerHTML = "";
    
    solicitudes.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.apellido}</td>
        <td>${item.correo}</td>
        <td>${item.motivo}</td>
        <td>${item.ubicacion}</td>
        <td>
          <button class="approve-btn" data-id="${item._id}">Aprobar</button>
          <button class="reject-btn" data-id="${item._id}">Rechazar</button>
        </td>
      `;
      solicitudesBody.appendChild(row);
    });
  };

  solicitudesBody.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    
    if (e.target.classList.contains("approve-btn")) {
      try {
        const response = await fetch(`/api/solicitudes/${id}/aprobar`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          Swal.fire('¡Aprobado!', 'La solicitud ha sido aprobada.', 'success');
          await renderSolicitudes();
        }
      } catch (error) {
        console.error('Error al aprobar:', error);
      }
    }

    if (e.target.classList.contains("reject-btn")) {
      const { value: motivo } = await Swal.fire({
        title: 'Motivo del rechazo',
        input: 'text',
        inputPlaceholder: 'Ingrese el motivo del rechazo'
      });
      
      if (motivo) {
        try {
          const response = await fetch(`/api/solicitudes/${id}/rechazar`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ motivo })
          });
          
          if (response.ok) {
            Swal.fire('¡Rechazado!', 'La solicitud ha sido rechazada.', 'info');
            await renderSolicitudes();
          }
        } catch (error) {
          console.error('Error al rechazar:', error);
        }
      }
    }
  });

  await renderSolicitudes();
});