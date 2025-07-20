 function openPopup() {
            window.open("crearempremdimiento.html", "_blank", "width=400,height=600");
        }

        const popupPromocion = document.getElementById('popupPromocion');

        document.querySelectorAll('.promo').forEach(item => {
            item.addEventListener('click', event => {
                popupPromocion.style.display = 'flex';
            });
        });

        function cerrarPopupPromocion() {
            popupPromocion.style.display = 'none';
        }

        window.onclick = function(evento) {
            if (evento.target == popupPromocion) { 
                cerrarPopupPromocion();
            }
        }