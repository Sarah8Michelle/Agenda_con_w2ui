var config = {
    grid: {
        name: 'grid',
        url: '/Product/GetAllRecords',
        method: 'GET',
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
                { type: 'button', id: 'w2ui-details', text: 'Detalles', icon: 'w2ui-icon-info', tooltip: 'Detalles del registro(s) seleccionado(s)', disabled: true }
            ],
            onClick: function (target, data) {
                if (target == 'w2ui-details') {
                    data.onComplete = function () {
                        var selections = w2ui.grid.getSelection();
                        var record = w2ui.grid.get(selections[0]);

                        w2ui['detail'].clear();
                        w2ui['detail'].add([
                            { recid: 0, name: 'Nombre:', value: record.name },
                            { recid: 1, name: 'Categoría:', value: record.category },
                            { recid: 2, name: 'Cantidad por Unidad:', value: record.quantityPerUnit },
                            { recid: 3, name: 'Precio por Unidad:', value: record.unitPrice },
                            { recid: 4, name: 'Unidades en Almacén:', value: record.unitsInStock },
                            { recid: 5, name: 'Unidades en Pedidos:', value: record.unitsInOrder },
                            { recid: 6, name: '¿Descontinuado?:', value: record.discontinued }
                        ]);

                        detail();
                    }
                }
            }
        },
        searches: [
            { field: 'name', text: 'Nombre', type: 'text' },
            { field: 'category', text: 'Categoría', type: 'text' },
            { field: 'unitPrice', text: 'Precio por Unidad', type: 'money' }
        ],
        sortData: [{ field: 'name', direction: 'DESC' }],
        columns: [
            { field: 'name', text: 'Nombre', sortable: true, resizable: true },
            { field: 'category', text: 'Categoría', sortable: true, resizable: true },
            { field: 'quantityPerUnit', text: 'Cantidad por Unidad', sortable: true, resizable: true },
            { field: 'unitPrice', text: 'Precio de Unidad', sortable: true, resizable: true, render: 'money' },
            { field: 'unitsInStock', text: 'Unidades en Almacén', sortable: true, resizable: true },
            { field: 'unitsInOrder', text: 'Unidades en Pedidos', sortable: true, resizable: true },
            {
                field: 'discontinued', sortable: true, text: '¿Descontinuado?', resizable: true, style: 'text-align: center', size: '90px', render: function (record, index, column_index) {
                    var html = record.isActive ? '<i class="fas fa-check-circle fa-lg text-success aria-hidden="true"></i>' : '<i class="fas fa-times-circle fa-lg text-danger aria-hidden="true"></i>';
                    return html;
                }
            }
        ],
        onSelect: function (event) {
            var grid = this;
            event.onComplete = function () {
                var record = this.get(event.recid);
                //check if a record is selected.
                if (grid.get(grid.getSelection()[0]) !== null) {
                    w2ui['grid'].toolbar.enable('w2ui-details');
                }
            }
        },
        onUnselect: function (event) {
            event.onComplete = function () {
                w2ui['grid'].toolbar.disable('w2ui-details');
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
                    console.log(record, editMode);
                    openPopup(record.id, editMode);

                    $('#category').w2field().set({ id: record.category, text: record.category })
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
    $('#productGrid').w2grid(config.grid);
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
                url: '/Product/Delete/' + selectedId.id,
                async: true
            }).done(function (e) {
                w2ui.grid.remove(selectedId.id);
                w2ui['grid'].reload();
            });
        }
    }
}