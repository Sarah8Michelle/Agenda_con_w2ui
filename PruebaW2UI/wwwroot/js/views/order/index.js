var config = {
    grid: {
        name: 'grid',
        url: '/Order/GetAllRecords',
        method: 'GET',
        recid: 'id',
        show: {
            header: true,  // indicates if header is visible
            toolbar: true,  // indicates if toolbar is visible
            footer: true,  // indicates if footer is visible
            lineNumbers: true,  // indicates if line numbers column is visible
        },
        multiSort: true,
        toolbar: {
            items: [
                { type: 'button', id: 'w2ui-add', text: 'Añadir nuevo/a', icon: 'w2ui-icon-plus', tooltip: 'Añadir nuevo registro' },
                { type: 'button', id: 'w2ui-edit', text: 'Editar', icon: 'w2ui-icon-pencil', tooltip: 'Editar registro(s) seleccionado(s)' },
                { type: 'button', id: 'w2ui-delete', text: 'Eliminar', icon: 'w2ui-icon-cross', tooltip: 'Eliminar registro(s) seleccionado(s)' },
                { type: 'break' },
                { type: 'button', id: 'w2ui-details', text: 'Detalles', icon: 'w2ui-icon-info', tooltip: 'Detalles del registro(s) seleccionado(s)', disabled: true },
                { type: 'button', id: 'w2ui-extended_details', text: 'Detalles de la Orden', icon: 'icon-page', tooltip: 'Detalles en relación al producto', disabled: true }
            ],
            onClick: function (target, data) {
                if (target == 'w2ui-details') {
                    data.onComplete = function () {
                        var selections = w2ui.grid.getSelection();
                        var record = w2ui.grid.get(selections[0]);

                        w2ui['detail'].clear();
                        w2ui['detail'].add([
                            { recid: 0, name: 'Código:', value: record.code },
                            { recid: 1, name: 'Fecha de Orden:', value: record.orderDate },
                            { recid: 2, name: 'Fecha de Entrega:', value: record.arrivalDate },
                            { recid: 3, name: 'Compañía de Envíos:', value: record.shipCompany },
                            { recid: 4, name: 'Dirección de Envío:', value: record.shipAddress },
                            { recid: 5, name: 'Ciudad de Envío:', value: record.shipCity },
                            { recid: 6, name: 'Región de Envío:', value: record.shipRegion },
                            { recid: 7, name: 'País de Envío:', value: record.shipCountry },
                            { recid: 8, name: 'Código Postal:', value: record.shipPostalCode },
                            { recid: 9, name: 'Cliente:', value: record.person.fullName }
                        ]);

                        detail();
                    }
                }

                else if (target == 'w2ui-add') {
                    DropdownPerson();
                }

                else if (target == 'w2ui-extended_details') {
                    data.onComplete = function () {
                        var selections = w2ui.grid.getSelection();
                        var record = w2ui.grid.get(selections[0]);

                        if (record != null) {
                            openOrderDetailsModal(record);
                        }
                    }
                }
            }
        },
        searches: [
            { field: 'code', text: 'Código', type: 'text' },
            { field: 'orderDate', text: 'Fecha de Orden', type: 'date' },
            { field: 'arrivalDate', text: 'Fecha de Entrega', type: 'date' },
            { field: 'shipCompany', text: 'Compañía de Envíos', type: 'date' }
        ],
        sortData: [{ field: 'code', direction: 'DESC' }],
        columns: [
            { field: 'code', text: 'Código', sortable: true, resizable: true },
            { field: 'orderDate', text: 'Fecha de Orden', sortable: true, resizable: true, render: 'datetime:dd/mm/yyyy|h12' },
            { field: 'arrivalDate', text: 'Fecha de Entrega', sortable: true, resizable: true, render: 'date:dd/mm/yyyy' },
            { field: 'shipCompany', text: 'Compañía de Envíos', sortable: true, resizable: true },
            {
                field: 'personId', text: 'Cliente', sortable: true, resizable: true, render: function (record) {
                    //console.log(record);
                    return '<div>' + record.person.fullName + '</div>';
                }
            },
        ],
        onSelect: function (event) {
            var grid = this;
            event.onComplete = function () {
                var record = this.get(event.recid);
                //check if a record is selected.
                if (grid.get(grid.getSelection()[0]) !== null) {
                    w2ui['grid'].toolbar.enable('w2ui-details');
                    w2ui['grid'].toolbar.enable('w2ui-extended_details');
                }
            }
        },
        onUnselect: function (event) {
            event.onComplete = function () {
                w2ui['grid'].toolbar.disable('w2ui-details');
                w2ui['grid'].toolbar.disable('w2ui-extended_details');
            }
        },
        onAdd: function (event) {
            event.onComplete = function () {
                openPopup(null);
            }
        },
        onEdit: function (event) {
            event.onComplete = function () {
                var record = this.get(event.recid);
                var editMode = true;

                if (record != null) {
                    DropdownPerson();

                    //console.log(JSON.stringify(record));
                    openPopup(record.id, editMode);

                    $('#personId').w2field().set({ id: record.personId, text: record.person.fullName });
                }
            }
        },
        onDelete: function (target, data) {
            data.preventDefault();

            $().w2popup({
                width: 400,
                height: 180,
                showMax: false,
                title: 'Eliminar registro(s)',
                body: '<div class="w2ui-grid-delete-msg w2ui-centered">¿Desea eliminar el(los) registro(s)?</div>',
                buttons: '<button class="w2ui-btn" onclick="w2popup.close();">Cancelar</button>' +
                    '<button class="w2ui-btn" onclick="deleteRecord(); w2popup.close();">Eliminar</button>'
            });
        }
    }
};

var detailGrid = {
    grid: {
        header: 'Detalles',
        show: { header: true, columnHeaders: false },
        name: 'detail',
        columns: [
            { field: 'name', caption: 'Nombre', size: '150px', style: 'background-color: #efefef; border-bottom: 1px solid white; padding-right: 5px;', attr: "align=right" },
            { field: 'value', caption: 'Valor', size: '100%' }
        ]
    }
};

function refreshGrid(auto) {
    w2ui.grid.autoLoad = auto;
    w2ui.grid.skip(0);
}

// init
$(function () {
    $('#orderGrid').w2grid(config.grid);
    $().w2grid(detailGrid.grid);
});

function deleteRecord() {

    var grid = w2ui['grid'];

    var selection = grid.getSelection();

    if (selection.length) {
        var selectedId = grid.get(selection[0]);
        console.log(selectedId.id);

        if (selectedId.id > 0) {
            $.ajax({
                type: 'POST',
                url: '/Order/Delete/' + selectedId.id,
                async: true
            }).done(function (e) {
                w2ui.grid.remove(selectedId.id);
                w2ui['grid'].reload();
            });
        }
    }
}