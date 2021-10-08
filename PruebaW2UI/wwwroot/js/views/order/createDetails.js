var pstyle = 'border: 1px solid #efefef; padding: 5px;';

var createDetailsConfig = {
    layout: {
        name: 'createDetailsLayout',
        panels: [
            { type: 'top', size: '50%', style: pstyle, minSize: 150, resizable: true },
            { type: 'main', size: 240, style: pstyle, resizable: true }
        ]
    },
    grid: {
        name: 'createDetailsGrid',
        url: { save:'/OrderDetail/CreateOrEdit'},
        columns: [
            { field: 'orderId', text: 'Orden', hidden: true },
            { field: 'productId', text: 'Producto', hidden: true },
            { field: 'orderCode', text: 'Código de Orden' },
            { field: 'productName', text: 'Nombre del Producto' },
            { field: 'quantity', text: 'Cantidad', size:'20%' },
            { field: 'unitPrice', text: 'Precio por Unidad', size: '32%', render: 'money' }
        ],
        records: []
    },
    form: {
        header: 'Información General',
        name: 'createDetailsForm',
        fields: [
            { field: 'orderId', type: 'int', hidden: true },
            {
                field: 'orderCode', type: 'text',
                html: {
                    label: 'Código de Orden',
                    span: 7,
                    attr: 'style="width: calc(100% - 10px)" readonly'
                }
            },
            {
                field: 'productId', type: 'list', required: true,
                html: {
                    label: 'Producto',
                    span: 7,
                    attr: 'placeholder="Seleccione un producto..."; style="width:calc(100% - 10px)"'
                },
                options: {
                    url: '/OrderDetail/DropdownProduct',
                    minLength: 0,
                    msgNoItems: 'No se encontraron coincidencias.'
                }
            },
            {
                field: 'quantity', type: 'int', required: true,
                html: {
                    label: 'Cantidad del Producto',
                    span: 7,
                    attr: 'style="width: calc(100% - 10px)"'
                }
            },
            {
                field: 'unitPrice', type: 'money', required: true,
                html: {
                    label: 'Precio por Unidad',
                    span: 7,
                    attr: 'style="width: calc(100% - 10px)"'
                }
            }
        ],
        actions: {
            clear: {
                text: 'Limpiar',
                onClick() {
                    this.clear();
                }
            },
            add: {
                text: '<i class="fa fa-plus"></i> Agregar',
                class: 'w2ui-btn-green',
                onClick() {
                    if (w2ui.createDetailsForm.validate().length == 0) {
                        addDetailsToGrid();
                    }
                }
            }
        }
    },
    init: function (record) {
        w2ui.createDetailsForm.record = {
            orderId: record.id,
            orderCode: record.code
        }
        w2ui.createDetailsForm.refresh();
    }
}

function openOrderDetailsModal(record) {
    if (!w2ui.createDetailsLayout) {
        $().w2layout(createDetailsConfig.layout);
    }

    if (!w2ui.createDetailsGrid) {
        $().w2grid(createDetailsConfig.grid);
    }

    if (!w2ui.createDetailsForm) {
        $().w2form(createDetailsConfig.form);
    }


    w2popup.open({
        title: record.code,
        width: 900,
        height: 600,
        showMax: true,
        modal: true,
        body: '<div id="main" style="position: absolute; left: 1px; top: 1px; right: 1px; bottom: 1px;"></div>',
        buttons: '<button class="w2ui-btn" onclick="w2popup.close();">Cancelar</button>' +
            '<button class="w2ui-btn w2ui-btn-blue" onclick="saveChanges()"><i class="fa fa-save"></i> Guardar</button>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('createDetailsLayout');
                w2ui.createDetailsLayout.html('main', w2ui.createDetailsGrid);
                w2ui.createDetailsLayout.html('top', w2ui.createDetailsForm);
                createDetailsConfig.init(record);
            }
        },
        onClose: function (event) {
            event.onComplete = function () {
                //clear form from data
                w2ui.createDetailsGrid.clear();
            }
        },
        onToggle: function (event) {
            event.onComplete = function () {
                //fix layout size to new modal size
                w2ui.createDetailsLayout.resize();
            }
        }
    });
}

function addDetailsToGrid() {
    var order = w2ui.createDetailsForm.getValue('orderId');
    var orderCode = w2ui.createDetailsForm.getValue('orderCode');
    var product = w2ui.createDetailsForm.getValue('productId');
    var quantity = w2ui.createDetailsForm.getValue('quantity');
    var unitPrice = w2ui.createDetailsForm.getValue('unitPrice');

    if (w2ui.createDetailsGrid.find({ productId: product.id }).length == 0) {
        w2ui.createDetailsGrid.add({ recid: w2ui.createDetailsGrid.records.length + 1, orderId: order, orderCode: orderCode, productId: product.id, productName: product.text, quantity: quantity, unitPrice: unitPrice });
        console.log(w2ui.createDetailsGrid.records);
    }
    else {
        w2alert('El producto ya ha sido agregado a esta orden.');
    }
}

function saveChanges() {
    
    if (w2ui.createDetailsGrid.records.length > 0) {
        $.ajax({
            url: '/OrderDetail/Create',
            type: 'POST',
            data: JSON.stringify(w2ui.createDetailsGrid.records),
            contentType: 'application/json',
            success: function () {
                w2ui.grid.skip(0);
                w2popup.close();
            },
            error: function () {
                w2popup.unlock();
            }
        });
    }

    else {
        w2alert('No existen productos por guardar...');
    }
}